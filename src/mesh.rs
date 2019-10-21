// mesh.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Only a container for data; passes self off to RenderSystem immediately

use vecmat::vec::{Vec2, Vec3};

use web_sys::WebGlBuffer;

#[derive(Debug)]
pub struct Mesh {
    vertices: Vec<Vec3<f32>>,
    normals: Vec<Vec3<f32>>,
    uvs: Vec<Vec2<f32>>,

    vbo: WebGlBuffer,
}
