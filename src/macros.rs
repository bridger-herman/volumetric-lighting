//! wre_frame.rs
//!
//! Copyright (c) 2019, Univerisity of Minnesota
//!
//! Author: Bridger Herman (herma582@umn.edu)
//!
//! Useful and necessary macros for the Wasm Rendering Engine

#[macro_export]
macro_rules! wre_frame {
    () => {
        *crate::state::WRE_FRAME.try_lock().unwrap()
    };
}

#[macro_export]
macro_rules! wre_entities {
    () => {
        *crate::state::WRE_ENTITIES.try_lock().unwrap()
    };
}
