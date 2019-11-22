// transform.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Transformation matrix for 3-space, stored in a 4x4 matrix

use glam::{Mat4, Quat, Vec3, Vec4};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Transform {
    matrix: Mat4,
    position: Vec3,
    rotation: Quat,
    scale: Vec3,
}

#[wasm_bindgen]
impl Transform {
    #[wasm_bindgen(constructor)]
    pub fn new(position: Vec3, rotation: Quat, scale: Vec3) -> Self {
        let matrix =
            Mat4::from_scale_rotation_translation(scale, rotation, position);
        Self {
            matrix,
            position,
            rotation,
            scale,
        }
    }

    pub fn identity() -> Self {
        Self {
            matrix: Mat4::identity(),
            position: Vec3::zero(),
            rotation: Quat::identity(),
            scale: Vec3::one(),
        }
    }

    pub fn translation(position: Vec3) -> Self {
        let mut ret = Self::identity();
        ret.set_position(position);
        ret
    }

    pub fn lerp(&self, other: &Transform, t: f32) -> Self {
        let position = self.position.lerp(other.position, t);
        let rotation = self.rotation.lerp(other.rotation, t);
        let scale = self.scale.lerp(other.scale, t);
        let matrix =
            Mat4::from_scale_rotation_translation(scale, rotation, position);
        Self {
            matrix,
            position,
            rotation,
            scale,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn matrix(&self) -> Mat4 {
        self.matrix
    }
    #[wasm_bindgen(setter)]
    pub fn set_matrix(&mut self, new_matrix: Mat4) {
        self.matrix = new_matrix;
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Vec3 {
        self.position
    }
    #[wasm_bindgen(setter)]
    pub fn set_position(&mut self, new_position: Vec3) {
        self.position = new_position;
        self.matrix = Mat4::from_scale_rotation_translation(
            self.scale,
            self.rotation,
            self.position,
        );
    }
    #[wasm_bindgen(getter)]
    pub fn scale(&self) -> Vec3 {
        self.scale
    }
    #[wasm_bindgen(setter)]
    pub fn set_scale(&mut self, new_scale: Vec3) {
        self.scale = new_scale;
        self.matrix = Mat4::from_scale_rotation_translation(
            self.scale,
            self.rotation,
            self.position,
        );
    }
    #[wasm_bindgen(getter)]
    pub fn rotation(&self) -> Quat {
        self.rotation
    }
    #[wasm_bindgen(setter)]
    pub fn set_rotation(&mut self, new_rotation: Quat) {
        self.rotation = new_rotation;
        self.matrix = Mat4::from_scale_rotation_translation(
            self.scale,
            self.rotation,
            self.position,
        );
    }

    #[wasm_bindgen(getter)]
    pub fn right(&self) -> Vec3 {
        self.matrix.x_axis().truncate()
    }
    #[wasm_bindgen(getter)]
    pub fn up(&self) -> Vec3 {
        self.matrix.y_axis().truncate()
    }
    #[wasm_bindgen(getter)]
    pub fn forward(&self) -> Vec3 {
        self.matrix.z_axis().truncate()
    }

    pub fn set_basis(&mut self, right: &Vec3, up: &Vec3, forward: &Vec3) {
        self.matrix.set_x_axis(right.extend(0.0));
        self.matrix.set_y_axis(up.extend(0.0));
        self.matrix.set_z_axis(forward.extend(0.0));

        // Extract the scale and rotation from the matrix
        let scale = Vec3::new(self.matrix.x_axis().length(), self.matrix.y_axis().length(), self.matrix.z_axis().length());
        let rotation_matrix = Mat4::new(
            Vec4::new(self.matrix.x_axis().0 / scale.x(), self.matrix.x_axis().1 / scale.y(), self.matrix.x_axis().2 / scale.z(), 0.0),
            Vec4::new(self.matrix.y_axis().0 / scale.x(), self.matrix.y_axis().1 / scale.y(), self.matrix.y_axis().2 / scale.z(), 0.0),
            Vec4::new(self.matrix.z_axis().0 / scale.x(), self.matrix.z_axis().1 / scale.y(), self.matrix.z_axis().2 / scale.z(), 0.0),
            Vec4::unit_w(),
        );
        self.rotation = Quat::from_rotation_mat4(&rotation_matrix);
    }
}
