/* spinMonkey.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Move some lights and halos around
 */

import * as wre from '../pkg/wre_wasm.js';
import { WreScript } from '../wre.js';

export class SpinMonkey extends WreScript {
    start() {
        this._time = 0.0;
        this._frequency = 10.0;
        this._amplitude = 1.0;
    }

    update() {
        let dtSec = wre.time_dt().nanos / 10e9;
        this._time += dtSec;

        let s = Math.sin(this._frequency * this._time);

        let t = this.transform;
        t.position = new wre.Vec3(-3.0, 2.0 + this._amplitude * s, 0.0);
    }
}

