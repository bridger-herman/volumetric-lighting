// frame.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Tracks timing information about the GLFW window

use std::time::Duration;

// Replaced std::time::Instant with instant crate because it panics in wasm
use instant::Instant;

use crate::traits::Update;

#[derive(Debug)]
pub struct FrameTimer {
    current_time: Instant,
    pub dt: Duration,
    previous_time: Instant,
    fps_time: Instant,
    frame_counter: usize,
}

impl FrameTimer {
    pub fn second_elapsed(&mut self) -> Option<(usize, Duration)> {
        if self.current_time > self.fps_time + Duration::from_secs(1) {
            let fc = self.frame_counter;
            self.frame_counter = 0;
            self.fps_time = self.current_time;
            Some((fc, self.dt))
        } else {
            None
        }
    }
}

impl Default for FrameTimer {
    fn default() -> Self {
        Self {
            current_time: Instant::now(),
            dt: Duration::from_millis(0),
            previous_time: Instant::now(),
            fps_time: Instant::now(),
            frame_counter: 0,
        }
    }
}

impl Update for FrameTimer {
    fn update(&mut self) {
        self.current_time = Instant::now();
        self.dt = self.current_time - self.previous_time;

        // Update FPS counter
        self.frame_counter += 1;
        self.previous_time = self.current_time;
    }
}
