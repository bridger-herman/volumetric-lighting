/* lightManager.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Move some lights and halos around
 */

import * as wre from '../pkg/wre_wasm.js';
import { WreScript } from '../wre.js';

export class CircleLight extends WreScript {
    start() {
        this._time = 0.0;
        this._frequency = 10.0;
        this._amplitude = 6.0;
        this._numLights = 4;
        this._sep = (2 * Math.PI) / this._numLights;
    }

    update() {
        let dtSec = wre.time_dt().nanos / 10e9;
        this._time += dtSec;

        for (let i = 0; i < this._numLights; i++) {
            let s = Math.sin(this._frequency * this._time + this._sep * i);
            let c = Math.cos(this._frequency * this._time + this._sep * i);

            let light = wre.get_spot_light(i);
            light.position = new wre.Vec3(this._amplitude * s, 1.0,
                this._amplitude * c);
            wre.set_spot_light(i, light);
        }
    }
}
