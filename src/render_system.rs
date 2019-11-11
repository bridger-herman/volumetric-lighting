// render_system.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Renders with WebGL, using wasm-bindgen and web-sys

use std::collections::HashMap;

use wasm_bindgen::JsCast;
use web_sys::{WebGl2RenderingContext, WebGlProgram};

use crate::entity::EntityId;
use crate::mesh::Mesh;

const SHADER_NAME: &str = "default2";

// #[derive(Default)]
pub struct RenderSystem {
    meshes: Vec<Mesh>,
    shaders: HashMap<String, WebGlProgram>,
    ready: bool,
    gl: WebGl2RenderingContext,
}

unsafe impl Send for RenderSystem {}

impl RenderSystem {
    pub fn render(&self) {
        if !self.ready {
            return;
        }
        self.gl.use_program(Some(&self.shaders[SHADER_NAME]));

        self.gl.clear_color(0.0, 0.0, 0.0, 1.0);
        self.gl.clear(
            WebGl2RenderingContext::COLOR_BUFFER_BIT
                | WebGl2RenderingContext::DEPTH_BUFFER_BIT,
        );

        for mesh in &self.meshes {
            self.gl.bind_vertex_array(Some(&mesh.vao));

            let model_matrix = wre_entities!(mesh.attached_to)
                .transform()
                .matrix()
                .to_flat_vec();
            let model_uniform_location = self
                .gl
                .get_uniform_location(&self.shaders[SHADER_NAME], "uni_model");
            self.gl.uniform_matrix4fv_with_f32_array(
                model_uniform_location.as_ref(),
                false,
                &model_matrix,
            );

            let color: [f32; 4] =
                wre_entities!(mesh.attached_to).material().color.into();
            let color_uniform_location = self
                .gl
                .get_uniform_location(&self.shaders[SHADER_NAME], "uni_color");
            self.gl.uniform4fv_with_f32_array(
                color_uniform_location.as_ref(),
                &color,
            );

            self.gl.draw_arrays(
                WebGl2RenderingContext::TRIANGLES,
                0,
                mesh.num_vertices,
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
        self.gl.use_program(Some(&self.shaders[SHADER_NAME]));
        self.meshes
            .push(Mesh::from_obj_str(&self.gl, eid, obj_text));
        debug!("Loaded mesh into entity {}", eid);
    }
}

impl Default for RenderSystem {
    fn default() -> Self {
        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .expect("Unable to get canvas");

        let gl = canvas
            .get_context("webgl2")
            .unwrap()
            .unwrap()
            .dyn_into::<WebGl2RenderingContext>()
            .expect("Unable to get WebGL context");

        gl.enable(WebGl2RenderingContext::DEPTH_TEST);

        Self {
            meshes: Vec::default(),
            shaders: HashMap::default(),
            ready: false,
            gl,
        }
    }
}
