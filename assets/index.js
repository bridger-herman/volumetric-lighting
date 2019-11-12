/* index.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Main file
 */

import { importWasm } from './loadWasm.js';
import { initWre, loadResource } from './wre.js'
import { Scene } from './scene.js'
import { MoveTest } from './user-scripts/moveTest.js'
import * as wre from './pkg/wre_wasm.js';

function loadImageAsync(path) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

function init() {
    loadImageAsync('./resources/img/test.png').then((img) => {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var dataUrl = canvas.toDataURL('image/png');
        let tex = wre.add_texture(dataUrl);
        console.log(tex);
    });
    // initWre().then(() => {
        // Scene.loadSceneAsync('./resources/scenes/easy.json');
        // wre.add_texture
    // });
}

window.onload = () => importWasm().then(init);
