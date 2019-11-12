/* index.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Main file
 */

import { importWasm } from './loadWasm.js';
import { initWre, loadTextResource, loadImage } from './wre.js'
import { loadSceneAsync } from './scene.js'
import { MoveTest } from './user-scripts/moveTest.js'
import * as wre from './pkg/wre_wasm.js';


function init() {
    initWre().then(() => {
        loadSceneAsync('./resources/scenes/easy.json');
    });
}

window.onload = () => importWasm().then(init);
