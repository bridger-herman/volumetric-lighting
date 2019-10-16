// frame.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Information about the Wasm Rendering Engine's current frame

use crate::frame_timer::FrameTimer;
use vecmat::vec::Vec3;

#[derive(Debug)]
pub struct WreFrame {
    /// Timing information
    pub timer: FrameTimer,

    /// Key presses that have happened in this frame
    pub key_presses: Vec<String>,

    /// Key releases that have happened in this frame
    pub key_releases: Vec<String>,

    /// Delta in position of the mouse cursor
    pub cursor_delta: Vec3<usize>,
}

impl Default for WreFrame {
    fn default() -> Self {
        Self {
            timer: FrameTimer::default(),
            key_presses: Vec::new(),
            key_releases: Vec::new(),
            cursor_delta: Vec3::new(),
        }
    }
}
