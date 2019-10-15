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

#[wasm_bindgen(module = "/assets/jsScript.js")]
extern "C" {
    pub type JsScript;

    #[wasm_bindgen(constructor)]
    fn new() -> JsScript;

    #[wasm_bindgen(method)]
    fn update(this: &JsScript);
}

unsafe impl Send for JsScript {}
unsafe impl Sync for JsScript {}

impl fmt::Debug for JsScript {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        write!(fmt, "JsScript")
    }
}

#[derive(Default)]
pub struct ScriptManager {
    entity_scripts: HashMap<EntityId, JsScript>,
}

impl ScriptManager {
    pub fn add_script(&mut self, eid: EntityId, script: JsScript) {
        self.entity_scripts.insert(eid, script);
    }
}

impl Update for ScriptManager {
    fn update(&mut self) {
        for (_entity, script) in self.entity_scripts.iter_mut() {
            script.update();
        }
    }
}
