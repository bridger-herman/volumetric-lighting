// material.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Data container for material information

use wasm_bindgen::prelude::*;

use glam::Vec4;

use crate::texture::TextureId;

#[wasm_bindgen]
#[derive(Debug, Default, Clone, Copy)]
pub struct Material {
    pub shader_id: usize,
    pub color: Vec4,
    pub specular: Vec4,
    pub texture_id: Option<TextureId>,
}

#[wasm_bindgen]
impl Material {
    #[wasm_bindgen(constructor)]
    pub fn new(
        shader_id: usize,
        color: Vec4,
        specular: Option<Vec4>,
        texture_id: Option<TextureId>,
    ) -> Self {
        let specular = specular.unwrap_or(Vec4::new(
            color.x(),
            color.y(),
            color.z(),
            100.0,
        ));
        Self {
            shader_id,
            color,
            specular,
            texture_id,
        }
    }
}
