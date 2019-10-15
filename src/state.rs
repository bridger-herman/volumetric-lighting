//! state.rs
//!
//! Copyright (c) 2019, Univerisity of Minnesota
//!
//! Author: Bridger Herman (herma582@umn.edu)
//!
//! Global state for the WebAssembly Rendering Engine, such as:
//! - Current frame information
//! - Entity manager

use std::sync::Mutex;

use crate::frame::WreFrame;

lazy_static! {
    pub static ref WRE_FRAME: Mutex<WreFrame> = Mutex::new(WreFrame::default());
}
