import { importWasm } from './loadWasm.js';
import * as wre from './pkg/wre_wasm.js'; // Example import

function init() {
    console.log('Hello from JavaScript!');
    // console.log(wre);
    // let val = wre.do_work();
    // console.log(val);
    // wre.main_loop();
}

window.onload = () => importWasm().then(init);
