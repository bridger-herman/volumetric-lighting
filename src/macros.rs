// wre_frame.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

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
    ($eid:expr) => {
        &*crate::state::WRE_ENTITIES.try_lock().unwrap().get($eid)
    };
    ($eid:expr, $mutable:expr) => {
        &mut *crate::state::WRE_ENTITIES.try_lock().unwrap().get_mut($eid)
    };
}

#[macro_export]
macro_rules! wre_entities_mut {
    () => {
        &mut *crate::state::WRE_ENTITIES.try_lock().unwrap()
    };
}

#[macro_export]
macro_rules! wre_scripts {
    () => {
        *crate::state::WRE_SCRIPTS.try_lock().unwrap()
    };
}

#[macro_export]
macro_rules! wre_render_system {
    () => {
        *crate::state::WRE_RENDER_SYSTEM.try_lock().unwrap()
    };
}
