// material.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Data container for material information

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Material {
    pub color: [f32; 4],
}
