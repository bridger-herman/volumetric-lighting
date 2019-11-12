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
import { Scene } from './scene.js'
import { MoveTest } from './user-scripts/moveTest.js'
import * as wre from './pkg/wre_wasm.js';


function init() {
    initWre().then(() => {
        Scene.loadSceneAsync('./resources/scenes/easy.json');
        loadImage('./resources/img/test.png').then((dataUrl) => {
            let tex = wre.add_texture(dataUrl);
        })
    });
}

window.onload = () => importWasm().then(init);
