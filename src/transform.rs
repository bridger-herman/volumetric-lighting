// transform.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Transformation matrix for 3-space, stored in a 4x4 matrix

use glam::{Vec3, Mat4, Quat};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Transform {
    matrix: Mat4,
    position: Vec3,
    rotation: Vec3,
    scale: Vec3,
}

#[wasm_bindgen]
impl Transform {
    #[wasm_bindgen(constructor)]
    pub fn new(position: Vec3, rotation: Quat, scale: Vec3) -> Self {
        let matrix = Mat4::from_scale_rotation_translation(scale, rotation, position);
        Self {
            matrix: Mat4::identity(),
            position: Vec3::zero(),
            rotation: Vec3::zero(),
            scale: Vec3::one(),
        }
    }

    pub fn identity() -> Self {
        Self {
            matrix: Mat4::identity(),
            position: Vec3::zero(),
            rotation: Vec3::zero(),
            scale: Vec3::one(),
        }
    }

    pub fn matrix(&self) -> Mat4 {
        self.matrix
    }
}
