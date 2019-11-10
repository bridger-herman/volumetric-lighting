// entity.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Entity (GameObject)

use wasm_bindgen::prelude::*;

use crate::material::Material;
use crate::transform::Transform;

pub type EntityId = usize;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Entity {
    pub id: EntityId,
    pub transform: Transform,
    pub material: Material,
}

#[wasm_bindgen]
impl Entity {
    #[wasm_bindgen(constructor)]
    pub fn new(id: EntityId) -> Self {
        Self {
            id,
            transform: Transform::identity(),
            material: Material::default(),
        }
    }
}
