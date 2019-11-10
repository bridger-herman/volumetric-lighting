// shader.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Useful functions for shaders

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{WebGl2RenderingContext, WebGlProgram, WebGlShader};

#[wasm_bindgen]
pub fn compile_vert_shader(source: &str) -> WebGlShader {
    compile_shader(WebGl2RenderingContext::VERTEX_SHADER, source)
}

#[wasm_bindgen]
pub fn compile_frag_shader(source: &str) -> WebGlShader {
    compile_shader(WebGl2RenderingContext::FRAGMENT_SHADER, source)
}

fn compile_shader(shader_type: u32, source: &str) -> WebGlShader {
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
    let shader = context
        .create_shader(shader_type)
        .expect("Unable to create shader object");
    context.shader_source(&shader, source);
    context.compile_shader(&shader);

    if context
        .get_shader_parameter(&shader, WebGl2RenderingContext::COMPILE_STATUS)
        .as_bool()
        .unwrap_or(false)
    {
        shader
    } else {
        let err_string = context
            .get_shader_info_log(&shader)
            .unwrap_or_else(|| String::from("Unknown error creating shader"));
        error!("Error compiling shader: {:?}", err_string);
        panic!();
    }
}

#[wasm_bindgen]
pub fn link_shader_program(
    vert_shader: &WebGlShader,
    frag_shader: &WebGlShader,
) -> WebGlProgram {
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
    let program = context
        .create_program()
        .expect("Unable to create shader program");

    context.attach_shader(&program, vert_shader);
    context.attach_shader(&program, frag_shader);
    context.link_program(&program);

    if context
        .get_program_parameter(&program, WebGl2RenderingContext::LINK_STATUS)
        .as_bool()
        .unwrap_or(false)
    {
        program
    } else {
        let err_string =
            context.get_program_info_log(&program).unwrap_or_else(|| {
                String::from("Unknown error creating program object")
            });
        error!("Error linking shaders: {:?}", err_string);
        panic!();
    }
}
