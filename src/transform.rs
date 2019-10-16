// transform.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Transformation matrix for 3-space, stored in a 4x4 matrix

use vecmat::vec::Vec3;

#[derive(Debug, Serialize, Deserialize)]
pub struct Transform {
    pub position: Vec3<f32>,
    pub rotation: Vec3<f32>,
    pub scale: Vec3<f32>,
}

impl Transform {
    pub fn new(
        position: Vec3<f32>,
        rotation: Vec3<f32>,
        scale: Vec3<f32>,
    ) -> Self {
        Self {
            position,
            rotation,
            scale,
        }
    }

    pub fn identity() -> Self {
        Self {
            position: Vec3::<f32>::new(),
            rotation: Vec3::<f32>::new(),
            scale: Vec3::from(1.0, 1.0, 1.0),
        }
    }
}
