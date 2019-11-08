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


function init() {
    initWre().then(() => {
        let eid = wre.create_entity();
        let e = wre.get_entity(eid);
        console.log(e.transform.matrix().to_flat_vec());
    });
}

window.onload = () => importWasm().then(init);
