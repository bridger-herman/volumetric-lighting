/* index.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Main file
 */

import { importWasm } from './loadWasm.js';
import { initWre } from './wre.js'
import * as wre from './pkg/wre_wasm.js';


function init() {
    wre.load_scene_async('./resources/scenes/new-format.json').then(() => {
        wre.init_window();
        initWre();
    });
}

window.onload = () => importWasm().then(init);
