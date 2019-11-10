// material.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Data container for material information

use wasm_bindgen::prelude::*;

use glam::Vec4;

#[wasm_bindgen]
#[derive(Debug, Default, Clone, Copy)]
pub struct Material {
    pub color: Vec4,
}

#[wasm_bindgen]
impl Material {
    #[wasm_bindgen(constructor)]
    pub fn new(color: Vec4) -> Self {
        Self { color }
    }
}
