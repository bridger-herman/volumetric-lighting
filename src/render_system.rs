// render_system.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Renders with WebGL, using wasm-bindgen and web-sys

use std::collections::HashMap;

use web_sys::WebGlProgram;

use crate::mesh::Mesh;

#[derive(Default)]
pub struct RenderSystem {
    meshes: Vec<Mesh>,
    shaders: HashMap<String, WebGlProgram>,
}

unsafe impl Send for RenderSystem {}

impl RenderSystem {
    pub fn new() -> Self {
        // let document = web_sys::window().unwrap().document().unwrap();
        // let canvas = document.get_element_by_id("canvas").unwrap();
        // let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into::<web_sys::HtmlCanvasElement>()?;

        // let context = canvas
        // .get_context("webgl")?
        // .unwrap()
        // .dyn_into::<WebGlRenderingContext>()?;

        // let vert_shader = compile_shader(
        // &context,
        // WebGlRenderingContext::VERTEX_SHADER,
        // r#"
        // attribute vec4 position;
        // void main() {
        // gl_Position = position;
        // }
        // "#,
        // )?;
        // let frag_shader = compile_shader(
        // &context,
        // WebGlRenderingContext::FRAGMENT_SHADER,
        // r#"
        // void main() {
        // gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
        // }
        // "#,
        // )?;

        // let program = link_program(&context, &vert_shader, &frag_shader)?;

        // context.use_program(Some(&program));

        // let vertices = vec![-0.7, -0.7, 0.0, 0.7, -0.7, 0.0, 0.0, 0.7, 0.0];

        // let buffer = context.create_buffer().ok_or("failed to create buffer")?;
        // context.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&buffer));

        // Note that `Float32Array::view` is somewhat dangerous (hence the
        // `unsafe`!). This is creating a raw view into our module's
        // `WebAssembly.Memory` buffer, but if we allocate more pages for ourself
        // (aka do a memory allocation in Rust) it'll cause the buffer to change,
        // causing the `Float32Array` to be invalid.
        //
        // As a result, after `Float32Array::view` we have to be very careful not to
        // do any memory allocations before it's dropped.
        // unsafe {

        // let vert_array = js_sys::Float32Array::view(&vertices);

        // context.buffer_data_with_array_buffer_view(
        // WebGlRenderingContext::ARRAY_BUFFER,
        // &vert_array,
        // WebGlRenderingContext::STATIC_DRAW,
        // );
        // }

        // context.vertex_attrib_pointer_with_i32(0, 3, WebGlRenderingContext::FLOAT, false, 0, 0);
        // context.enable_vertex_attrib_array(0);

        // context.clear_color(0.0, 0.0, 0.0, 1.0);
        // context.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);

        // context.draw_arrays(
        // WebGlRenderingContext::TRIANGLES,
        // 0,
        // (vertices.len() / 3) as i32,
        // );

        Self {
            meshes: vec![],
            shaders: HashMap::new(),
        }

        // info!("Initialized RenderSystem");

        // Ok(new_self)
    }

    pub fn meshes(&self) -> &Vec<Mesh> {
        &self.meshes
    }

    pub fn add_shader(&mut self, name: &str, program: &WebGlProgram) {
        self.shaders.insert(name.to_string(), program.clone());
    }
}
