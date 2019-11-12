// render_system.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Renders with WebGL, using wasm-bindgen and web-sys

use wasm_bindgen::JsCast;
use web_sys::{WebGl2RenderingContext, WebGlProgram};

use crate::entity::EntityId;
use crate::mesh::Mesh;
use crate::texture::{Texture, TextureId};

pub struct WebGlContextWrapper {
    pub gl: WebGl2RenderingContext,
}

impl Default for WebGlContextWrapper {
    fn default() -> Self {
        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .expect("Unable to get canvas");

        let gl: WebGl2RenderingContext = canvas
            .get_context("webgl2")
            .unwrap()
            .unwrap()
            .dyn_into::<WebGl2RenderingContext>()
            .expect("Unable to get WebGL context");

        Self {
            gl
        }
    }
}

unsafe impl Send for WebGlContextWrapper {}

pub struct RenderSystem {
    meshes: Vec<Mesh>,
    textures: Vec<Texture>,
    shaders: Vec<WebGlProgram>,
    shader_names: Vec<String>,
    ready: bool,
}

unsafe impl Send for RenderSystem {}

impl RenderSystem {
    pub fn render(&self) {
        if !self.ready {
            return;
        }

        wre_gl!().clear_color(0.0, 0.0, 0.0, 1.0);
        wre_gl!().clear(
            WebGl2RenderingContext::COLOR_BUFFER_BIT
                | WebGl2RenderingContext::DEPTH_BUFFER_BIT,
        );

        for mesh in &self.meshes {
            let shader = &self.shaders[wre_entities!(mesh.attached_to).material().shader_id];
            wre_gl!().use_program(Some(shader));
            wre_gl!().bind_vertex_array(Some(&mesh.vao));

            let model_matrix = wre_entities!(mesh.attached_to)
                .transform()
                .matrix()
                .to_flat_vec();
            let model_uniform_location = wre_gl!()
                .get_uniform_location(shader, "uni_model");
            wre_gl!().uniform_matrix4fv_with_f32_array(
                model_uniform_location.as_ref(),
                false,
                &model_matrix,
            );

            let color: [f32; 4] =
                wre_entities!(mesh.attached_to).material().color.into();
            let color_uniform_location = wre_gl!()
                .get_uniform_location(shader, "uni_color");
            wre_gl!().uniform4fv_with_f32_array(
                color_uniform_location.as_ref(),
                &color,
            );

            wre_gl!().draw_arrays(
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

    pub fn add_shader(&mut self, name: &str, program: &WebGlProgram) -> usize {
        self.shaders.push(program.clone());
        self.shader_names.push(name.to_string());
        self.shaders.len() - 1
    }

    pub fn add_obj_mesh(&mut self, eid: EntityId, obj_text: &str) {
        let shader = &self.shaders[wre_entities!(eid).material().shader_id];
        wre_gl!().use_program(Some(shader));
        self.meshes
            .push(Mesh::from_obj_str(eid, obj_text));
    }

    pub fn add_texture(&mut self, png_bytes: &[u8]) -> TextureId {
        let tex = Texture::init_from_image(self.textures.len(), png_bytes);
        self.textures.push(tex);
        self.textures.len() - 1
    }
}

impl Default for RenderSystem {
    fn default() -> Self {
        wre_gl!().enable(WebGl2RenderingContext::DEPTH_TEST);

        Self {
            textures: Vec::default(),
            meshes: Vec::default(),
            shaders: Vec::default(),
            shader_names: Vec::default(),
            ready: false,
        }
    }
}
