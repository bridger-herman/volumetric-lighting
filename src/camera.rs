// camera.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Scene camera (FPS-style)

use std::f32::consts;

use glam::{Mat4, Vec3, Vec2, Quat, Vec4};

use crate::transform::Transform;
use crate::traits::Update;

const ANGULAR_VELOCITY: f32 = 0.0005;
const LINEAR_VELOCITY: f32 = 0.001;

#[derive(Debug)]
pub struct Camera {
    view_matrix: Mat4,
    projection_matrix: Mat4,
    transform: Transform,
    velocity: Vec3,
    /// Rotation about the x and y axes (screen y and x axes)
    rotation: Vec2,
}

impl Camera {
    pub fn new(position: Vec3) -> Self {
        let mut ret = Self::default();
        ret.transform.set_position(position);
        ret
    }

    pub fn transform(&self) -> Transform {
        self.transform
    }
    pub fn velocity(&self) -> Vec3 {
        self.velocity
    }
    pub fn set_velocity(&mut self, velocity: Vec3) {
        self.velocity = velocity;
    }
    pub fn rotation(&self) -> Vec2 {
        self.rotation
    }
    pub fn set_rotation(&mut self, rotation: Vec2) {
        self.rotation = rotation;
    }

    // Start moving in a direction (specified by the camera's basis)
    pub fn start_moving(&mut self, direction: Vec3) {
        self.velocity = direction * LINEAR_VELOCITY;
    }
    pub fn stop_moving(&mut self) {
        self.velocity = Vec3::zero();
    }
    pub fn add_rotation(&mut self, delta: Vec2) {
        self.rotation += delta * ANGULAR_VELOCITY;
    }
}

impl Default for Camera {
    fn default() -> Self {
        let transform = Transform::identity();
        Self {
            view_matrix: Mat4::look_at_rh(transform.position(), transform.position() + transform.forward(), transform.up()),
            projection_matrix: Mat4::perspective_glu_rh(consts::FRAC_PI_4, 16.0 / 9.0, 0.1, 300.0),
            transform,
            rotation: Vec2::zero(),
            velocity: Vec3::zero(),
        }
    }
}

impl Update for Camera {
    fn update(&mut self) {
        // self.process_events();

        let dt = wre_time!().dt.subsec_millis() as f32;
        self.transform.set_position(self.transform.position()
            + (self.transform.forward() * dt * self.velocity.z()
                + self.transform.right() * dt * self.velocity.x())
        );

        // Rotation about the camera's local x and y axes
        let local_rotation = Quat::from_rotation_ypr(self.rotation.y(), self.rotation.x(), 0.0);
        let rotation = Mat4::from_quat(local_rotation);
        // let new_matrix = rotation * self.transform.matrix();
        // self.transform.set_matrix(new_matrix);

        // self.transform.set_rotation(Quat::from_rotation_ypr(self.rotation.y(), self.rotation.x(), 0.0));
        // info!("Rotation: {:?}", rotation.to_string());
        // rotation = rotation.rotate()
        // rotation = glm::ext::rotate(
            // &rotation,
            // self.rotation.y,
            // glm::vec3(0.0, 1.0, 0.0),
        // );
        // rotation = glm::ext::rotate(
            // &rotation,
            // self.rotation.x,
            // glm::vec3(1.0, 0.0, 0.0),
        // );

        let new_forward = (rotation * Vec4::unit_z()).truncate();
        let new_up = (rotation * Vec4::unit_y()).truncate();
        let new_right = new_forward.cross(new_up);
        self.transform.set_basis(&new_right, &new_up, &new_forward);

        // self.basis.c0 = (rotation * glm::vec4(0.0, 0.0, -1.0, 0.0)).truncate(3);
        // self.basis.c1 = (rotation * glm::vec4(0.0, 1.0, 0.0, 0.0)).truncate(3);
        // self.basis.c2 = glm::builtin::cross(self.basis.c0, self.basis.c1);

        self.view_matrix = Mat4::look_at_rh(self.transform.position(), self.transform.position() + self.transform.forward(), self.transform.up());
    }
}
