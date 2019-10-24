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

    pub fn position(&self) -> Vec3 {
        self.position
    }
    pub fn rotation(&self) -> Quat {
        self.rotation
    }
    pub fn scale(&self) -> Vec3 {
        self.scale
    }

    pub fn set_position(&mut self, new_position: Vec3) {
        self.position = new_position;
        self.matrix = Mat4::from_scale_rotation_translation(self.scale, self.rotation, self.position);
    }
    pub fn set_rotation(&mut self, new_rotation: Quat) {
        self.rotation = new_rotation;
        self.matrix = Mat4::from_scale_rotation_translation(self.scale, self.rotation, self.position);
    }
    pub fn set_scale(&mut self, new_scale: Vec3) {
        self.scale = new_scale;
        self.matrix = Mat4::from_scale_rotation_translation(self.scale, self.rotation, self.position);
    }
}
