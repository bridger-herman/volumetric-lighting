/* wre.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Assorted useful JavaScript interactions for WRE
 */

import * as wre from './pkg/wre_wasm.js';

function initCamera() {
    let oldMousePosition = wre.Vec2.zero();

    // Listen for mouse moves so we can move the camera
    document.addEventListener('mousemove', (evt) => {
        let currentMousePosition = new wre.Vec2((evt.clientY -
            window.outerHeight / 2.0), -(evt.clientX - window.outerWidth /
                2.0));
        let mouseDelta = currentMousePosition.sub(oldMousePosition);
        wre.add_camera_rotation(mouseDelta);
        oldMousePosition = currentMousePosition;
    });

    // Listen for keyboard events to start moving the camera
    document.addEventListener('keydown', (evt) => {
        switch (evt.key) {
            case 'w':
                wre.start_moving_camera(wre.Vec3.unit_z()); break;
            case 'a':
                wre.start_moving_camera(wre.Vec3.unit_x()); break;
            case 's':
                wre.start_moving_camera(wre.Vec3.unit_z().neg()); break;
            case 'd':
                wre.start_moving_camera(wre.Vec3.unit_x().neg()); break;
            default: 
                break;
        }
    });

    // Listen for keyboard events to stop moving the camera
    document.addEventListener('keyup', (evt) => {
        switch (evt.key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                wre.stop_moving_camera();
            default: 
                break;
        }
    });
}

export function initWre() {
    initCamera();
}

export class WreScript {
    constructor(owner) {
        this._entityId = owner;
        this._entity = wre.get_entity(this._entityId);
        this.transform = wre.Transform.identity();
        this.start();
    }

    updateWrapper() {
        // Move the entity to JS
        this._entity = wre.get_entity(this._entityId);

        this.transform = this._entity.transform;
        this.update();
        this._entity.transform = this.transform;

        // Move the entity back to Rust
        wre.set_entity(this._entityId, this._entity);
        // BE CAREFUL, this._entity doesn't exist between here and when
        // get_entity() is called at the top of updateWrapper()
    }

    getTransform() {
        return this.transform.matrix.elements;
    }

    // To be implemented by inheriters
    start() {}
    update() {}
}
