/* resource.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Main file
 */

import { importWasm } from './loadWasm.js';
import { WreScript } from './wre-js/wreScript.js'
import { initShader } from './wre-js/shader.js'
import { loadResource } from './wre-js/resource.js'
import * as wre from './pkg/wre_wasm.js';

function init() {
    initShader('unlit');

    let e = wre.create_entity();
    loadResource('/resources/models/hex.obj').then((obj_text) => {
        wre.add_mesh(e, obj_text);
    });
    // let s = new WreScript(e);
    // wre.add_script(e, s);
}

window.onload = () => importWasm().then(init);
