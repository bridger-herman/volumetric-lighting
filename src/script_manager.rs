// script_manager.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Script manager

use std::collections::HashMap;
use std::fmt;

use crate::entity::EntityId;
use crate::traits::Update;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/assets/wre-js/wreScript.js")]
extern "C" {
    pub type WreScript;

    #[wasm_bindgen(constructor)]
    fn new() -> WreScript;

    #[wasm_bindgen(method)]
    fn updateWrapper(this: &WreScript);
}

unsafe impl Send for WreScript {}
unsafe impl Sync for WreScript {}

impl fmt::Debug for WreScript {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        write!(fmt, "WreScript")
    }
}

#[derive(Default)]
pub struct ScriptManager {
    entity_scripts: HashMap<EntityId, WreScript>,
}

impl ScriptManager {
    pub fn add_script(&mut self, eid: EntityId, script: WreScript) {
        self.entity_scripts.insert(eid, script);
    }
}

impl Update for ScriptManager {
    fn update(&mut self) {
        for (_entity, script) in self.entity_scripts.iter_mut() {
            script.updateWrapper();
        }
    }
}
