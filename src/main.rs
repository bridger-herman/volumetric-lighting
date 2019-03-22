#[macro_use]
extern crate log;
extern crate wasm_logger;

/// Binary for testing non-wasm code
fn main() {
    wasm_logger::init_with_level(log::Level::Trace)
        .expect("Failed to initialize logger");

    info!("Hello, world!");
}
