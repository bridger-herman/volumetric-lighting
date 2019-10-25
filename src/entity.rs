// entity.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Entity (GameObject)

use crate::transform::Transform;
use crate::material::Material;

pub type EntityId = usize;

#[derive(Debug, Serialize, Deserialize)]
pub struct Entity {
    pub id: EntityId,
    pub transform: Transform,
    pub material: Material,
}

impl Entity {
    pub fn update_transform_matrix(&mut self, matrix: &[f32; 16]) {
        self.transform.matrix = *matrix;
    }
}
