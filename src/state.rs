// state.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Global state for the WebAssembly Rendering Engine
//! - Current frame information
//! - Entity manager

use std::sync::Mutex;

use crate::entity_manager::EntityManager;
use crate::frame::WreFrame;
use crate::render_system::RenderSystem;
use crate::script_manager::ScriptManager;

lazy_static! {
    /// Current frame information (timing, key presses, etc.)
    pub static ref WRE_FRAME: Mutex<WreFrame> = Mutex::new(WreFrame::default());

    /// Entity manager for the game
    pub static ref WRE_ENTITIES: Mutex<EntityManager> = Mutex::new(EntityManager::default());

    /// Script manager for the game
    pub static ref WRE_SCRIPTS: Mutex<ScriptManager> = Mutex::new(ScriptManager::default());

    /// Rendering system
    pub static ref WRE_RENDER_SYSTEM: Mutex<RenderSystem> = Mutex::new(RenderSystem::default());
}
