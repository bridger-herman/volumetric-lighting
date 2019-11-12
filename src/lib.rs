#[macro_use]
extern crate serde_derive;
extern crate wasm_bindgen;
#[macro_use]
extern crate log;
extern crate wasm_logger;
#[macro_use]
extern crate lazy_static;
extern crate glam;
extern crate instant;
extern crate obj;
extern crate png;
extern crate base64;

#[macro_use]
pub mod macros;

pub mod entity;
pub mod entity_manager;
pub mod frame;
pub mod frame_timer;
pub mod material;
pub mod mesh;
pub mod render_system;
pub mod script_manager;
pub mod shader;
pub mod state;
pub mod texture;
pub mod traits;
pub mod transform;
pub mod window;

use wasm_bindgen::prelude::*;
use web_sys::WebGlProgram;

use crate::entity::{Entity, EntityId};
use crate::texture::TextureId;
use crate::script_manager::WreScript;

pub use glam::{Mat4, Quat, Vec3};

const TARGET_FPS: i32 = 30;

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

#[wasm_bindgen]
pub fn add_shader(name: &str, program: WebGlProgram) -> usize {
    wre_render_system!().add_shader(name, &program)
}

#[wasm_bindgen]
pub fn add_mesh(eid: EntityId, obj_source: &str) {
    wre_render_system!().add_obj_mesh(eid, obj_source);
}

#[wasm_bindgen]
pub fn add_texture(b64_bytes: &str) -> TextureId {
    let header_end = b64_bytes.find(",").unwrap();
    let png_bytes = base64::decode(&b64_bytes.as_bytes()[(header_end + 1)..]).unwrap();
    wre_render_system!().add_texture(&png_bytes)
}

#[wasm_bindgen]
pub fn make_ready() {
    wre_render_system!().make_ready();
}
