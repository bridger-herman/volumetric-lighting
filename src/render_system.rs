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
            self.frame_buffer.render(&shader.program, &self.scene);
        }
    }

    /// Pass 1: Forward render all the meshes
    fn render_meshes(&self) {
        if let Some(scene) = &self.scene {
            for (_path, mesh) in &scene.meshes {
                // Don't render anything that's not attached to an entity
                for eid in &mesh.attached_to {
                    // Load the shader and VAO for this material and model
                    let shader_id = wre_entities!(*eid).material().shader_id;
                    let shader = scene
                        .get_shader_by_id(shader_id)
                        .unwrap_or_else(|| {
                            error_panic!("No shader with id: {}", shader_id);
                        });
                    wre_gl!().use_program(Some(&shader.program));
                    wre_gl!().bind_vertex_array(Some(&mesh.vao));

                    // Send the camera position for lighting information
                    let camera_position: Vec<f32> =
                        wre_camera!().transform().position().into();
                    let camera_position_location = wre_gl!()
                        .get_uniform_location(
                            &shader.program,
                            "uni_camera_position",
                        );
                    wre_gl!().uniform3fv_with_f32_array(
                        camera_position_location.as_ref(),
                        &camera_position,
                    );

                    // Send the model matrix to the GPU
                    let model_matrix = wre_entities!(*eid).transform().matrix();
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

                    // Send all the point lights over to the shader
                    let num_point_light_location = wre_gl!()
                        .get_uniform_location(
                            &shader.program,
                            "uni_num_point_lights",
                        );
                    wre_gl!().uniform1i(
                        num_point_light_location.as_ref(),
                        scene.point_lights.len() as i32,
                    );

                    if scene.point_lights.len() > 0 {
                        let point_light_positions: Vec<f32> = scene
                            .point_lights
                            .iter()
                            .map(|light| -> Vec<f32> { light.position.into() })
                            .flatten()
                            .collect();
                        let point_light_positions_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_point_light_positions",
                            );
                        wre_gl!().uniform3fv_with_f32_array(
                            point_light_positions_location.as_ref(),
                            &point_light_positions,
                        );

                        let point_light_colors: Vec<f32> = scene
                            .point_lights
                            .iter()
                            .map(|light| -> Vec<f32> { light.color.into() })
                            .flatten()
                            .collect();
                        let point_light_colors_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_point_light_colors",
                            );
                        wre_gl!().uniform3fv_with_f32_array(
                            point_light_colors_location.as_ref(),
                            &point_light_colors,
                        );

                        let point_light_halo_intensity: Vec<f32> = scene
                            .point_lights
                            .iter()
                            .map(|light| -> f32 { light.halo_intensity })
                            .collect();
                        let point_light_halo_intensity_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_point_light_halo_intensity",
                            );
                        wre_gl!().uniform1fv_with_f32_array(
                            point_light_halo_intensity_location.as_ref(),
                            &point_light_halo_intensity,
                        );
                    }

                    // Send all the spot lights over to the shader
                    let num_spot_light_location = wre_gl!()
                        .get_uniform_location(
                            &shader.program,
                            "uni_num_spot_lights",
                        );
                    wre_gl!().uniform1i(
                        num_spot_light_location.as_ref(),
                        scene.spot_lights.len() as i32,
                    );

                    if scene.spot_lights.len() > 0 {
                        let spot_light_positions: Vec<f32> = scene
                            .spot_lights
                            .iter()
                            .map(|light| -> Vec<f32> { light.position.into() })
                            .flatten()
                            .collect();
                        let spot_light_positions_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_spot_light_positions",
                            );
                        wre_gl!().uniform3fv_with_f32_array(
                            spot_light_positions_location.as_ref(),
                            &spot_light_positions,
                        );

                        let spot_light_directions: Vec<f32> = scene
                            .spot_lights
                            .iter()
                            .map(|light| -> Vec<f32> { light.direction.into() })
                            .flatten()
                            .collect();
                        let spot_light_directions_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_spot_light_directions",
                            );
                        wre_gl!().uniform3fv_with_f32_array(
                            spot_light_directions_location.as_ref(),
                            &spot_light_directions,
                        );

                        let spot_light_colors: Vec<f32> = scene
                            .spot_lights
                            .iter()
                            .map(|light| -> Vec<f32> { light.color.into() })
                            .flatten()
                            .collect();
                        let spot_light_colors_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_spot_light_colors",
                            );
                        wre_gl!().uniform3fv_with_f32_array(
                            spot_light_colors_location.as_ref(),
                            &spot_light_colors,
                        );

                        let spot_light_angle_inside: Vec<f32> = scene
                            .spot_lights
                            .iter()
                            .map(|light| -> f32 { light.angle_inside })
                            .collect();
                        let spot_light_angle_inside_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_spot_light_angle_inside",
                            );
                        wre_gl!().uniform1fv_with_f32_array(
                            spot_light_angle_inside_location.as_ref(),
                            &spot_light_angle_inside,
                        );

                        let spot_light_angle_outside: Vec<f32> = scene
                            .spot_lights
                            .iter()
                            .map(|light| -> f32 { light.angle_outside })
                            .collect();
                        let spot_light_angle_outside_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_spot_light_angle_outside",
                            );
                        wre_gl!().uniform1fv_with_f32_array(
                            spot_light_angle_outside_location.as_ref(),
                            &spot_light_angle_outside,
                        );

                        let spot_light_halo_intensity: Vec<f32> = scene
                            .spot_lights
                            .iter()
                            .map(|light| -> f32 { light.halo_intensity })
                            .collect();
                        let spot_light_halo_intensity_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_spot_light_halo_intensity",
                            );
                        wre_gl!().uniform1fv_with_f32_array(
                            spot_light_halo_intensity_location.as_ref(),
                            &spot_light_halo_intensity,
                        );
                    }

                    // Send the material's color to the GPU
                    let color: [f32; 4] =
                        wre_entities!(*eid).material().color.into();
                    let color_uniform_location = wre_gl!()
                        .get_uniform_location(&shader.program, "uni_color");
                    wre_gl!().uniform4fv_with_f32_array(
                        color_uniform_location.as_ref(),
                        &color,
                    );

                    // Send the material's specularity to the GPU
                    let specular: [f32; 4] =
                        wre_entities!(*eid).material().specular.into();
                    let specular_uniform_location = wre_gl!()
                        .get_uniform_location(&shader.program, "uni_specular");
                    wre_gl!().uniform4fv_with_f32_array(
                        specular_uniform_location.as_ref(),
                        &specular,
                    );

                    // If there's a texture, send it to the GPU
                    if let Some(texture_id) =
                        wre_entities!(*eid).material().texture_id()
                    {
                        wre_gl!()
                            .active_texture(WebGl2RenderingContext::TEXTURE0);
                        wre_gl!().bind_texture(
                            WebGl2RenderingContext::TEXTURE_2D,
                            Some(
                                &scene
                                    .get_texture_by_id(texture_id)
                                    .unwrap()
                                    .tex,
                            ),
                        );

                        let tex_uniform_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_texture",
                            );
                        wre_gl!().uniform1i(tex_uniform_location.as_ref(), 0);

                        let use_tex_uniform_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_use_texture",
                            );
                        wre_gl!()
                            .uniform1i(use_tex_uniform_location.as_ref(), 1);
                    } else {
                        let use_tex_uniform_location = wre_gl!()
                            .get_uniform_location(
                                &shader.program,
                                "uni_use_texture",
                            );
                        wre_gl!()
                            .uniform1i(use_tex_uniform_location.as_ref(), 0);
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
    }

    pub fn scene(&self) -> &Option<Scene> {
        &self.scene
    }

    pub fn mut_scene(&mut self) -> &mut Option<Scene> {
        &mut self.scene
    }

    /// Add a scene to the rendering system, consuming scene
    pub fn add_scene(&mut self, scene: Scene) {
        self.scene = Some(scene);
    }

    /// Load the post-processing shaders
    pub async fn load_post_processing_shader(&mut self) -> Result<(), JsValue> {
        let post_pro_name = "volumetric";
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
