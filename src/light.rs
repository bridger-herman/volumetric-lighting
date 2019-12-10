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

#[derive(Debug, Serialize, Deserialize)]
pub struct SpotLight {
    pub position: Vec3,
    pub color: Vec3,
    pub direction: Vec3,
    pub angle_inside: f32,
    pub angle_outside: f32,
}

impl SpotLight {
    pub fn new(
        position: Vec3,
        color: Vec3,
        direction: Vec3,
        angle_inside: f32,
        angle_outside: f32,
    ) -> Self {
        Self {
            position,
            color,
            direction,
            angle_inside,
            angle_outside,
        }
    }
}
