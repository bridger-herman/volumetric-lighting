import { importWasm } from './loadWasm.js';
import { WreScript } from './wre-js/wreScript.js'
import * as wre from './pkg/wre_wasm.js';

function init() {
    let e = wre.create_entity();
    let s = new WreScript(e);
    wre.add_script(e, s);
}

window.onload = () => importWasm().then(init);
