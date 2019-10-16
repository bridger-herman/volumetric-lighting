// window.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Window management and frame timing

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use crate::traits::Update;

const TITLE: &str = "Graphics";

pub fn init(target_fps: i32) -> Result<(), JsValue> {
    let window = web_sys::window().expect("window.rs: No window!");
    let main_loop_closure = Closure::wrap(Box::new(one_frame) as Box<dyn Fn()>);
    window.set_interval_with_callback_and_timeout_and_arguments_0(
        main_loop_closure.as_ref().unchecked_ref(),
        1000 / target_fps,
    )?;

    main_loop_closure.forget();

    Ok(())
}

pub fn one_frame() {
    wre_frame!().timer.update();

    set_title(&format!("{} | dt = {:?}", TITLE, wre_frame!().timer.dt));

    wre_scripts!().update();
}

fn set_title(title: &str) {
    let window = web_sys::window().expect("window.rs: No window!");
    let document = window.document().expect("window.rs: No document!");
    document.set_title(title);
}
