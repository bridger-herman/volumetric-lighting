/* resource.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Main file
 */

import { importWasm } from './loadWasm.js';
import { initWre, loadResource } from './wre.js'
import { MoveTest } from './user-scripts/moveTest.js'
import * as wre from './pkg/wre_wasm.js';


function init() {
    initWre().then(() => {
        let e = wre.create_entity();
        loadResource('/resources/models/sphere_smooth.obj').then((obj_text) => {
            wre.add_mesh(e, obj_text);
        }).then(() => {
            let s = new MoveTest(e);
            wre.add_script(e, s);
        }).then(() => {
            wre.set_color(e, [1, 0, 0, 1]);
        });
    });
}

window.onload = () => importWasm().then(init);
