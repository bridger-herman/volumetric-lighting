#[macro_use]
extern crate serde_derive;
extern crate wasm_bindgen;
#[macro_use]
extern crate log;
extern crate wasm_logger;
#[macro_use]
extern crate lazy_static;
extern crate instant;
extern crate wre_transform;

#[macro_use]
pub mod macros;

pub mod entity;
pub mod entity_manager;
pub mod frame;
pub mod frame_timer;
pub mod script_manager;
pub mod state;
pub mod traits;
pub mod window;

use wasm_bindgen::prelude::*;

use crate::entity::EntityId;
use crate::script_manager::JsScript;

const TARGET_FPS: i32 = 2;

#[wasm_bindgen(module = "/assets/entity.js")]
extern "C" {
    type JsEntity;

    #[wasm_bindgen(constructor)]
    fn new(id: u32) -> JsEntity;

    #[wasm_bindgen(method, getter)]
    fn id(this: &JsEntity) -> u32;
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    wasm_logger::init_with_level(log::Level::Info)
        .map_err(|_| JsValue::from("Failed to initialize logger"))?;

    window::init_window(TARGET_FPS)?;
    info!("Initialized window with target {}fps", TARGET_FPS);

    let e = JsEntity::new(47);
    info!("{:?}", e.id());

    Ok(())
}

#[wasm_bindgen]
pub fn create_entity() -> JsValue {
    JsValue::from_serde(&wre_entities!().create()).unwrap()
}

#[wasm_bindgen]
pub fn get_entity(id: EntityId) -> JsValue {
    JsValue::from_serde(&wre_entities!().get(id)).unwrap()
}

#[wasm_bindgen]
pub fn add_script(eid: EntityId, script: JsScript) {
    wre_scripts!().add_script(eid, script)
}
