// transform.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Transformation matrix for 3-space, stored in a 4x4 matrix

use glam::{Mat4, Vec3, Quat};

use crate::entity::EntityId;

#[derive(Debug, Serialize, Deserialize)]
pub struct Transform {
    pub owner: Option<EntityId>,
    pub parent: Option<EntityId>,

    position: Vec3,
    rotation: Quat,
    scale: Vec3,

    pub matrix: Mat4,
}

impl Transform {
    pub fn new(
        owner: EntityId,
        position: Vec3,
        rotation: Quat,
        scale: Vec3,
    ) -> Self {
        let matrix = Mat4::from_scale_rotation_translation(scale, rotation, position);
        Self {
            owner: Some(owner),
            parent: None,
            position,
            rotation,
            scale,
            matrix,
        }
    }

    pub fn identity() -> Self {
        Self {
            owner: None,
            parent: None,
            position: Vec3::zero(),
            rotation: Quat::identity(),
            scale: Vec3::one(),
            matrix: Mat4::identity(),
        }
    }

}
