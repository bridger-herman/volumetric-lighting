// resources.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! A collection of functions for asynchrously loading resources (shaders,
//! meshes, materials, textures, etc.) from the server
//!
//! Heavy inspiration from Wasm Bindgen Fetch Example

use js_sys::{ArrayBuffer, Uint8Array};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

/// Load a text resource from the server
/// Used for mesh, material, shader
#[wasm_bindgen]
pub async fn load_text_resource(path: String) -> Result<JsValue, JsValue> {
    info!("Loading text resource {}", path);

    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let request = Request::new_with_str_and_init(&path, &opts)?;

    let window = web_sys::window().unwrap();
    let resp_value =
        JsFuture::from(window.fetch_with_request(&request)).await?;

    let resp: Response = resp_value.dyn_into().unwrap_or_else(|err| {
        error_panic!("Response is not a Response: {:?}", err);
    });

    // Convert this other `Promise` into a rust `Future`.
    let text = JsFuture::from(resp.text()?).await?;
    Ok(text)
}

/// Load an image resource from the server
/// Used for texture
#[wasm_bindgen]
pub async fn load_image_resource(path: String) -> Result<Uint8Array, JsValue> {
    info!("Loading image resource {}", path);

    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let request = Request::new_with_str_and_init(&path, &opts)?;

    let window = web_sys::window().unwrap_or_else(|| {
        error_panic!("Unable to get DOM window");
    });
    let resp_value =
        JsFuture::from(window.fetch_with_request(&request)).await?;

    let resp: Response = resp_value.dyn_into().unwrap_or_else(|err| {
        error_panic!("Response is not a Response: {:?}", err);
    });

    // Convert this other `Promise` into a rust `Future`.
    let js_array = JsFuture::from(resp.array_buffer()?).await?;
    let array_buffer: ArrayBuffer = js_array.dyn_into().unwrap_or_else(|err| {
        error_panic!("Response is not an ArrayBuffer: {:?}", err);
    });

    let bytes = Uint8Array::new(&array_buffer);
    Ok(bytes)
}
