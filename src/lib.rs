#[macro_use]
extern crate serde_derive;
extern crate wasm_bindgen;
#[macro_use]
extern crate log;
#[macro_use]
extern crate wasm_logger;
#[macro_use]
extern crate lazy_static;
extern crate base64;
extern crate glam;
extern crate instant;
extern crate obj;
extern crate png;

#[macro_use]
pub mod macros;

pub mod camera;
pub mod entity;
pub mod entity_manager;
pub mod frame_buffer;
pub mod light;
pub mod material;
pub mod mesh;
pub mod render_system;
pub mod resources;
pub mod scene;
pub mod script_manager;
pub mod shader;
pub mod state;
pub mod texture;
pub mod time;
pub mod traits;
pub mod transform;
pub mod window;

use wasm_bindgen::prelude::*;

use crate::entity::{Entity, EntityId};
use crate::script_manager::WreScript;

pub use glam::{Mat4, Quat, Vec2, Vec3};

const TARGET_FPS: i32 = 30;

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    wasm_logger::init_with_level(log::Level::Info)
        .map_err(|_| JsValue::from("Failed to initialize logger"))?;

    Ok(())
}

#[wasm_bindgen]
pub fn init_window() -> Result<(), JsValue> {
    window::init(TARGET_FPS)?;
    info!("Initialized window with target {}fps", TARGET_FPS);

    Ok(())
}

#[wasm_bindgen]
pub fn time_dt() -> JsValue {
    JsValue::from_serde(&wre_time!().dt).unwrap()
}

#[wasm_bindgen]
pub fn set_camera_position(pos: Vec3) {
    wre_camera!().set_position(pos);
}

#[wasm_bindgen]
pub fn start_moving_camera(direction: Vec3) {
    wre_camera!().start_moving(direction);
}

#[wasm_bindgen]
pub fn stop_moving_camera() {
    wre_camera!().stop_moving();
}

#[wasm_bindgen]
pub fn add_camera_rotation(delta: Vec2) {
    wre_camera!().add_rotation(delta);
}

#[wasm_bindgen]
pub fn create_entity() -> JsValue {
    JsValue::from_serde(&wre_entities!().create()).unwrap()
}

#[wasm_bindgen]
pub fn destroy_entity(eid: EntityId) {
    wre_entities_mut!().remove(eid);
}

#[wasm_bindgen]
pub fn get_entity(id: EntityId) -> Entity {
    wre_entities!().get(id)
}

#[wasm_bindgen]
pub fn set_entity(id: EntityId, entity: Entity) {
    wre_entities!().set(id, entity);
}

#[wasm_bindgen]
pub fn add_script(eid: EntityId, script: WreScript) {
    wre_scripts!().add_script(eid, script)
}
