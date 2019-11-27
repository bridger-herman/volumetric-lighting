// light.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! A point light

use glam::Vec3;

#[derive(Debug, Serialize, Deserialize)]
pub struct PointLight {
    /// The light's position
    pub position: Vec3,

    /// The light's color
    pub color: Vec3,
}

impl PointLight {
    pub fn new(position: Vec3, color: Vec3) -> Self {
        Self { position, color }
    }
}
