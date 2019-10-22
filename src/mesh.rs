// mesh.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Only a container for data; passes self off to RenderSystem immediately

use std::fmt;

use web_sys::WebGlVertexArrayObject;

use crate::entity::EntityId;

pub struct Mesh {
    pub attached_to: EntityId,

    pub pos: Vec<f32>,

    pub vao: WebGlVertexArrayObject,
}

impl fmt::Debug for Mesh {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Mesh(attached_to: {0})", self.attached_to)
    }
}
