// window.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Window management and frame timing

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::KeyboardEvent;

use crate::traits::Update;

const TITLE: &str = "Graphics";
pub const DEFAULT_WINDOW_SIZE: (usize, usize) = (1280, 720);

#[derive(Default)]
pub struct WindowState {
    pub paused: bool,
}

pub fn init(target_fps: i32) -> Result<(), JsValue> {
    let window = web_sys::window().expect("window.rs: No window!");
    let main_loop_closure = Closure::wrap(Box::new(one_frame) as Box<dyn Fn()>);
    window.set_interval_with_callback_and_timeout_and_arguments_0(
        main_loop_closure.as_ref().unchecked_ref(),
        1000 / target_fps,
    )?;

    let pause_closure =
        Closure::wrap(Box::new(toggle_pause) as Box<dyn Fn(JsValue)>);
    window.add_event_listener_with_callback(
        "keydown",
        pause_closure.as_ref().unchecked_ref(),
    )?;

    main_loop_closure.forget();
    pause_closure.forget();

    Ok(())
}

fn toggle_pause(evt: JsValue) {
    let kb_event = evt.unchecked_into::<KeyboardEvent>();
    if kb_event.key() == "Escape" {
        let paused = wre_window!().paused;
        wre_window!().paused = !paused;
    }
}

fn one_frame() {
    if !wre_window!().paused {
        wre_time!().update();

        if let Some((fps, dt)) = wre_time!().second_elapsed() {
            set_title(&format!("{} | {:?}fps, dt = {:?}", TITLE, fps, dt));
        }

        wre_scripts!().update();
        wre_camera!().update();
        wre_render_system!().render();
    } else {
        set_title(&format!("{} | Paused", TITLE));
    }
}

fn set_title(title: &str) {
    let window = web_sys::window().expect("window.rs: No window!");
    let document = window.document().expect("window.rs: No document!");
    document.set_title(title);
}
