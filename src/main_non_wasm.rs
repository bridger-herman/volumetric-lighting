extern crate serde_derive;
extern crate wasm_bindgen;
#[macro_use]
extern crate log;
extern crate wasm_logger;
#[macro_use]
extern crate lazy_static;
extern crate wre_transform;

#[macro_use]
pub mod macros;

pub mod entity_manager;
pub mod entity;
pub mod frame;
pub mod frame_timer;
pub mod state;
pub mod traits;
pub mod window;

/// Binary for testing non-wasm code
fn main() {
    wasm_logger::init_with_level(log::Level::Trace)
        .expect("Failed to initialize logger");

    info!("Hello, world!");
}
