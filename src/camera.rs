// camera.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Scene camera (FPS-style)

use std::f32::consts;

use glam::{Mat4, Quat, Vec2, Vec3};

use crate::traits::Update;
use crate::transform::Transform;

const ANGULAR_VELOCITY: f32 = 0.004;
const LINEAR_VELOCITY: f32 = 0.002;

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

    pub fn set_position(&mut self, position: Vec3) {
        self.transform.set_position(position);
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

    pub fn view_matrix(&self) -> Mat4 {
        self.view_matrix
    }
    pub fn projection_matrix(&self) -> Mat4 {
        self.projection_matrix
    }
}

impl Default for Camera {
    fn default() -> Self {
        let transform = Transform::identity();
        Self {
            view_matrix: Mat4::look_at_rh(
                transform.position(),
                transform.position() + transform.forward(),
                transform.up(),
            ),
            projection_matrix: Mat4::perspective_glu_rh(
                consts::FRAC_PI_4,
                16.0 / 9.0,
                0.1,
                300.0,
            ),
            transform,
            rotation: Vec2::zero(),
            velocity: Vec3::zero(),
        }
    }
}

impl Update for Camera {
    fn update(&mut self) {
        let dt = wre_time!().dt.subsec_millis() as f32;
        self.transform.set_position(
            self.transform.position()
                + (self.transform.forward() * dt * self.velocity.z()
                    + self.transform.right() * dt * self.velocity.x()),
        );

        // Rotation about the camera's local x and y axes
        let local_rotation =
            Quat::from_rotation_ypr(self.rotation.y(), self.rotation.x(), 0.0);
        let rotation = Mat4::from_quat(local_rotation);
        let new_matrix = rotation * self.transform.matrix();
        self.transform.set_matrix(new_matrix);

        self.view_matrix = Mat4::look_at_rh(
            self.transform.position(),
            self.transform.position() + self.transform.forward(),
            self.transform.up(),
        );
    }
}
