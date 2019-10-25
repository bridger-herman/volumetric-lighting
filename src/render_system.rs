// render_system.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Renders with WebGL, using wasm-bindgen and web-sys

use std::collections::HashMap;
use std::io::BufReader;

use wasm_bindgen::JsCast;
use web_sys::{WebGlProgram, WebGl2RenderingContext};
use obj::{Obj, SimplePolygon};

use crate::mesh::Mesh;
use crate::entity::EntityId;

const SHADER_NAME: &str = "default2";

// #[derive(Default)]
pub struct RenderSystem {
    meshes: Vec<Mesh>,
    shaders: HashMap<String, WebGlProgram>,
    ready: bool,
}

unsafe impl Send for RenderSystem {}

impl RenderSystem {
    pub fn render(&self) {
        if !self.ready {
            return;
        }

        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .expect("Unable to get canvas");

        let context = canvas
            .get_context("webgl2")
            .unwrap()
            .unwrap()
            .dyn_into::<WebGl2RenderingContext>()
            .expect("Unable to get WebGL context");

        context.use_program(Some(&self.shaders[SHADER_NAME]));

        for mesh in &self.meshes {
            context.bind_vertex_array(Some(&mesh.vao));

            context.clear_color(0.0, 0.0, 0.0, 1.0);
            context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT |
                          WebGl2RenderingContext::DEPTH_BUFFER_BIT);

            let model_matrix = wre_entities!(mesh.attached_to).transform.matrix;
            let model_uniform_location = context.get_uniform_location(&self.shaders[SHADER_NAME], "uni_model");
            context.uniform_matrix4fv_with_f32_array(
                model_uniform_location.as_ref(),
                false,
                &model_matrix,
            );

            let color = wre_entities!(mesh.attached_to).material.color;
            let color_uniform_location = context.get_uniform_location(&self.shaders[SHADER_NAME], "uni_color");
            context.uniform4fv_with_f32_array(
                color_uniform_location.as_ref(),
                &color,
            );

            context.draw_arrays(
                WebGl2RenderingContext::TRIANGLES,
                0,
                (mesh.pos.len() / 3) as i32,
            );
        }
    }

    pub fn meshes(&self) -> &Vec<Mesh> {
        &self.meshes
    }

    pub fn make_ready(&mut self) {
        self.ready = true;
    }

    pub fn add_shader(&mut self, name: &str, program: &WebGlProgram) {
        self.shaders.insert(name.to_string(), program.clone());
    }

    pub fn add_obj_mesh(&mut self, eid: EntityId, obj_text: &str) {
        // Load the obj from a string
        let mut reader = BufReader::new(obj_text.as_bytes());
        let obj_file: Obj<SimplePolygon> = Obj::load_buf(&mut reader).expect("Unable to load obj file");

        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .expect("Unable to get canvas");

        let context = canvas
            .get_context("webgl2")
            .unwrap()
            .unwrap()
            .dyn_into::<WebGl2RenderingContext>()
            .expect("Unable to get WebGL context");

        context.use_program(Some(&self.shaders[SHADER_NAME]));

        // Collect the positions into triangles
        // TODO assuming only one group per object, and only one object per file
        let mut pos = vec![];
        for tri in &obj_file.objects[0].groups[0].polys {
            pos.push(obj_file.position[tri[0].0]);
            pos.push(obj_file.position[tri[1].0]);
            pos.push(obj_file.position[tri[2].0]);
        }
        let pos_flat: Vec<_> = pos.iter().flatten().cloned().collect();

        // Collect the normals into triangles
        // TODO assuming only one group per object, and only one object per file
        let mut norm = vec![];
        for tri in &obj_file.objects[0].groups[0].polys {
            norm.push(obj_file.normal[tri[0].2.unwrap()]);
            norm.push(obj_file.normal[tri[1].2.unwrap()]);
            norm.push(obj_file.normal[tri[2].2.unwrap()]);
        }
        let norm_flat: Vec<_> = norm.iter().flatten().cloned().collect();

        let vao = context.create_vertex_array().expect("failed to create vao");
        context.bind_vertex_array(Some(&vao));

        let vert_vbo = context.create_buffer().expect("failed to create vert_vbo");
        context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&vert_vbo));

        // Note that `Float32Array::view` is somewhat dangerous (hence the
        // `unsafe`!). This is creating a raw view into our module's
        // `WebAssembly.Memory` buffer, but if we allocate more pages for ourself
        // (aka do a memory allocation in Rust) it'll cause the buffer to change,
        // causing the `Float32Array` to be invalid.
        //
        // As a result, after `Float32Array::view` we have to be very careful not to
        // do any memory allocations before it's dropped.
        unsafe {
            let vert_array = js_sys::Float32Array::view(&pos_flat);

            context.buffer_data_with_array_buffer_view(
                WebGl2RenderingContext::ARRAY_BUFFER,
                &vert_array,
                WebGl2RenderingContext::STATIC_DRAW,
            );
        }

        context.enable_vertex_attrib_array(0);
        context.vertex_attrib_pointer_with_i32(
            0,
            3,
            WebGl2RenderingContext::FLOAT,
            false,
            0,
            0,
        );

        let norm_vbo = context.create_buffer().expect("failed to create norm_vbo");
        context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&norm_vbo));

        unsafe {
            let norm_array = js_sys::Float32Array::view(&norm_flat);

            context.buffer_data_with_array_buffer_view(
                WebGl2RenderingContext::ARRAY_BUFFER,
                &norm_array,
                WebGl2RenderingContext::STATIC_DRAW,
            );
        }

        context.enable_vertex_attrib_array(1);
        context.vertex_attrib_pointer_with_i32(
            1,
            3,
            WebGl2RenderingContext::FLOAT,
            false,
            0,
            0,
        );

        let m = Mesh {
            attached_to: eid,
            pos: pos_flat,
            vao,
        };
        self.meshes.push(m);
        info!("Loaded mesh into entity {}", eid);
    }
}

impl Default for RenderSystem {
    fn default() -> Self {
        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .expect("Unable to get canvas");

        let context = canvas
            .get_context("webgl2")
            .unwrap()
            .unwrap()
            .dyn_into::<WebGl2RenderingContext>()
            .expect("Unable to get WebGL context");

        context.enable(WebGl2RenderingContext::DEPTH_TEST);

        Self {
            meshes: Vec::default(),
            shaders: HashMap::default(),
            ready: false,
        }
    }
}
