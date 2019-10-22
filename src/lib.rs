#[macro_use]
extern crate serde_derive;
extern crate wasm_bindgen;
#[macro_use]
extern crate log;
extern crate wasm_logger;
#[macro_use]
extern crate lazy_static;
extern crate instant;
extern crate vecmat;
extern crate obj;

#[macro_use]
pub mod macros;

pub mod entity;
pub mod entity_manager;
pub mod frame;
pub mod frame_timer;
pub mod mesh;
pub mod render_system;
pub mod script_manager;
pub mod shader;
pub mod state;
pub mod traits;
pub mod transform;
pub mod window;

use wasm_bindgen::prelude::*;
use web_sys::WebGlProgram;

use crate::entity::EntityId;
use crate::script_manager::WreScript;

const TARGET_FPS: i32 = 2;

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    wasm_logger::init_with_level(log::Level::Info)
        .map_err(|_| JsValue::from("Failed to initialize logger"))?;

    window::init(TARGET_FPS)?;
    info!("Initialized window with target {}fps", TARGET_FPS);

    info!("{:?}", wre_render_system!().meshes());
    // render_system::init()?;
    // info!("Initialized WebGL render system");

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
pub fn set_entity(id: EntityId, entity: JsValue) {
    wre_entities!().set(id, entity.into_serde().unwrap())
}

#[wasm_bindgen]
pub fn add_script(eid: EntityId, script: WreScript) {
    wre_scripts!().add_script(eid, script)
}

#[wasm_bindgen]
pub fn add_shader(name: &str, program: WebGlProgram) {
    wre_render_system!().add_shader(name, &program);
}

#[wasm_bindgen]
pub fn add_mesh(eid: EntityId, obj_source: &str) {
    wre_render_system!().add_obj_mesh(eid, obj_source);
}
