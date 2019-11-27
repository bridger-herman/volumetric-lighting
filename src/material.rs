// material.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Data container for material information

use std::str::FromStr;

use glam::{Vec3, Vec4};
use wasm_bindgen::prelude::*;

use crate::texture::TextureId;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Material {
    pub shader_id: usize,
    pub color: Vec4,
    pub specular: Vec4,
    texture_id: Option<TextureId>,
}

#[wasm_bindgen]
impl Material {
    #[wasm_bindgen(constructor)]
    pub fn new(
        shader_id: usize,
        color: Vec4,
        specular: Option<Vec4>,
        texture_id: Option<TextureId>,
    ) -> Self {
        let specular = specular.unwrap_or(Vec4::new(
            color.x(),
            color.y(),
            color.z(),
            100.0,
        ));
        Self {
            shader_id,
            color,
            specular,
            texture_id,
        }
    }

    /// Partial implementation of wavefront obj mtl parsing (diffuse + specular
    /// + diffuse texture only)
    pub fn from_mtl_str(mtl_text: &str) -> Self {
        let lines: Vec<_> = mtl_text
            .lines()
            .filter(|&line| !line.starts_with('#') && !line.is_empty())
            .map(|line| {
                if let Some(index) = line.find('#') {
                    &line[..index]
                } else {
                    line
                }
            })
            .collect();
        let mut returned = Material::default();

        for line in lines {
            let lowercase = line.to_lowercase();
            let tokens: Vec<_> = lowercase.split_whitespace().collect();
            match tokens[0] {
                "kd" => {
                    // Diffuse color
                    let float_tokens = parse_slice(&tokens[1..]);
                    returned.color = Vec3::new(
                        float_tokens[0],
                        float_tokens[1],
                        float_tokens[2],
                    )
                    .extend(1.0);
                }
                "ks" => {
                    // Specular color
                    let float_tokens = parse_slice(&tokens[1..]);
                    returned.specular = Vec3::new(
                        float_tokens[0],
                        float_tokens[1],
                        float_tokens[2],
                    )
                    .extend(1.0);
                }
                "ns" => {
                    // Specular highlight exponent
                    let float_tokens = parse_slice(&tokens[1..]);
                    returned.specular.set_w(float_tokens[0]);
                }
                _ => (),
            }
        }

        returned
    }

    #[wasm_bindgen(getter)]
    pub fn texture_id(&self) -> Option<TextureId> {
        self.texture_id
    }
    #[wasm_bindgen(setter)]
    pub fn set_texture_id(&mut self, texture_id: Option<TextureId>) {
        self.texture_id = texture_id;
    }
}

impl Default for Material {
    fn default() -> Self {
        Self {
            shader_id: 0,
            color: Vec4::unit_w(),
            specular: Vec4::unit_w(),
            texture_id: None,
        }
    }
}

pub fn parse_slice<T: FromStr + Default>(str_slice: &[&str]) -> Vec<T> {
    str_slice
        .iter()
        .map(|&s| s.parse::<T>().unwrap_or_default())
        .collect()
}
