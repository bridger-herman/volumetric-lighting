// render_system.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Renders with WebGL, using wasm-bindgen and web-sys

use std::usize;

use wasm_bindgen::prelude::JsValue;
use wasm_bindgen::JsCast;
use web_sys::WebGl2RenderingContext;

use crate::frame_buffer::FrameBuffer;
use crate::scene::Scene;
use crate::shader::{load_shader, Shader};
use crate::window::DEFAULT_WINDOW_SIZE;

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

        Self { gl }
    }
}

unsafe impl Send for WebGlContextWrapper {}

pub struct RenderSystem {
    scene: Option<Scene>,
    post_processing_shader: Option<Shader>,
    frame_buffer: FrameBuffer,
}

unsafe impl Send for RenderSystem {}

impl RenderSystem {
    pub fn render(&self) {
        if self.scene.is_none() || self.post_processing_shader.is_none() {
            return;
        }

        self.frame_buffer.bind();

        wre_gl!().clear_color(0.0, 0.0, 0.0, 1.0);
        wre_gl!().clear(
            WebGl2RenderingContext::COLOR_BUFFER_BIT
                | WebGl2RenderingContext::DEPTH_BUFFER_BIT,
        );
        let (width, height) = DEFAULT_WINDOW_SIZE;
        wre_gl!().viewport(0, 0, width as i32, height as i32);

        // Save a texture image of rendered meshes to the frame buffer
        self.render_meshes();
        self.frame_buffer.unbind();

        // Splat that texture onto the viewport
        if let Some(shader) = &self.post_processing_shader {
            self.frame_buffer.render(&shader.program);
        }
    }

    /// Pass 1: Forward render all the meshes
    fn render_meshes(&self) {
        if let Some(scene) = &self.scene {
            for (_path, mesh) in &scene.meshes {
                // Don't render anything that's not attached to an entity
                if mesh.attached_to.is_none() {
                    warn!("Mesh {} not attached", _path);
                    return;
                }

                // Load the shader and VAO for this material and model
                let shader_id = wre_entities!(mesh.attached_to.unwrap())
                    .material()
                    .shader_id;
                let shader =
                    scene.get_shader_by_id(shader_id).unwrap_or_else(|| {
                        error_panic!("No shader with id: {}", shader_id);
                    });
                wre_gl!().use_program(Some(&shader.program));
                wre_gl!().bind_vertex_array(Some(&mesh.vao));

                // Send the camera position for lighting information
                let camera_position: Vec<f32> =
                    wre_camera!().transform().position().into();
                let camera_position_location = wre_gl!().get_uniform_location(
                    &shader.program,
                    "uni_camera_position",
                );
                wre_gl!().uniform3fv_with_f32_array(
                    camera_position_location.as_ref(),
                    &camera_position,
                );

                // Send the model matrix to the GPU
                let model_matrix =
                    wre_entities!(mesh.attached_to.unwrap_or_default())
                        .transform()
                        .matrix();
                let model_uniform_location = wre_gl!()
                    .get_uniform_location(&shader.program, "uni_model");
                wre_gl!().uniform_matrix4fv_with_f32_array(
                    model_uniform_location.as_ref(),
                    false,
                    &model_matrix.to_flat_vec(),
                );

                // Send the normal matrix (inverse transpose of model matrix) to the
                // GPU for calculating transform of normals
                let normal_matrix = model_matrix.inverse().transpose();
                let normal_uniform_location = wre_gl!()
                    .get_uniform_location(&shader.program, "uni_normal");
                wre_gl!().uniform_matrix4fv_with_f32_array(
                    normal_uniform_location.as_ref(),
                    false,
                    &normal_matrix.to_flat_vec(),
                );

                // Send the camera's view/projection matrix to the GPU
                let view_matrix = wre_camera!().view_matrix();
                let projection_matrix = wre_camera!().projection_matrix();
                let projection_view = projection_matrix * view_matrix;
                let pv_uniform_location = wre_gl!().get_uniform_location(
                    &shader.program,
                    "uni_projection_view",
                );
                wre_gl!().uniform_matrix4fv_with_f32_array(
                    pv_uniform_location.as_ref(),
                    false,
                    &projection_view.to_flat_vec(),
                );

                // Send all the lights over to the shader
                let num_light_location = wre_gl!()
                    .get_uniform_location(&shader.program, "uni_num_lights");
                wre_gl!().uniform1i(
                    num_light_location.as_ref(),
                    scene.lights.len() as i32,
                );

                let light_positions: Vec<f32> = scene
                    .lights
                    .iter()
                    .map(|light| -> Vec<f32> { light.position.into() })
                    .flatten()
                    .collect();
                let light_positions_location = wre_gl!().get_uniform_location(
                    &shader.program,
                    "uni_light_positions",
                );
                wre_gl!().uniform3fv_with_f32_array(
                    light_positions_location.as_ref(),
                    &light_positions,
                );

                let light_colors: Vec<f32> = scene
                    .lights
                    .iter()
                    .map(|light| -> Vec<f32> { light.color.into() })
                    .flatten()
                    .collect();
                let light_colors_location = wre_gl!()
                    .get_uniform_location(&shader.program, "uni_light_colors");
                wre_gl!().uniform3fv_with_f32_array(
                    light_colors_location.as_ref(),
                    &light_colors,
                );

                // Send the material's color to the GPU
                let color: [f32; 4] =
                    wre_entities!(mesh.attached_to.unwrap_or_default())
                        .material()
                        .color
                        .into();
                let color_uniform_location = wre_gl!()
                    .get_uniform_location(&shader.program, "uni_color");
                wre_gl!().uniform4fv_with_f32_array(
                    color_uniform_location.as_ref(),
                    &color,
                );

                // Send the material's specularity to the GPU
                let specular: [f32; 4] =
                    wre_entities!(mesh.attached_to.unwrap_or_default())
                        .material()
                        .specular
                        .into();
                let specular_uniform_location = wre_gl!()
                    .get_uniform_location(&shader.program, "uni_specular");
                wre_gl!().uniform4fv_with_f32_array(
                    specular_uniform_location.as_ref(),
                    &specular,
                );

                // If there's a texture, send it to the GPU
                if let Some(texture_id) =
                    wre_entities!(mesh.attached_to.unwrap_or_default())
                        .material()
                        .texture_id
                {
                    wre_gl!().active_texture(WebGl2RenderingContext::TEXTURE0);
                    wre_gl!().bind_texture(
                        WebGl2RenderingContext::TEXTURE_2D,
                        Some(&scene.get_texture_by_id(texture_id).unwrap().tex),
                    );

                    let tex_uniform_location = wre_gl!()
                        .get_uniform_location(&shader.program, "uni_texture");
                    wre_gl!().uniform1i(tex_uniform_location.as_ref(), 0);
                }

                // Draw the geometry
                wre_gl!().draw_arrays(
                    WebGl2RenderingContext::TRIANGLES,
                    0,
                    mesh.num_vertices,
                );

                wre_gl!().use_program(None);
            }
        }
    }

    /// Add a scene to the rendering system, consuming scene
    pub fn add_scene(&mut self, scene: Scene) {
        self.scene = Some(scene);
    }

    /// Load the post-processing shaders
    pub async fn load_post_processing_shader(&mut self) -> Result<(), JsValue> {
        let post_pro_name = "colorblur";
        let shader = load_shader(post_pro_name, usize::max_value()).await?;
        self.post_processing_shader = Some(shader);
        info!("Initialized post processing shader {}", post_pro_name);
        Ok(())
    }
}

impl Default for RenderSystem {
    fn default() -> Self {
        // Enable depth testing for proper object occlusion
        wre_gl!().enable(WebGl2RenderingContext::DEPTH_TEST);

        Self {
            scene: None,
            post_processing_shader: None,
            frame_buffer: FrameBuffer::default(),
        }
    }
}
