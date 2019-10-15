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

pub mod frame;
pub mod frame_timer;
pub mod state;
pub mod traits;
pub mod window;

use wasm_bindgen::prelude::*;

const TARGET_FPS: i32 = 2;

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    wasm_logger::init_with_level(log::Level::Info)
        .map_err(|_| JsValue::from("Failed to initialize logger"))?;

    window::init_window(TARGET_FPS)?;
    info!("Initialized window with target {}fps", TARGET_FPS);

    Ok(())
}
