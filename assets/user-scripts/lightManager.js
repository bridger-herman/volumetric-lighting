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

export class LightManager extends WreScript {
    keyHandler = (evt) => {
        let amount = 0.1;
        let light = wre.get_point_light(1);
        switch (evt.key) {
            case 'ArrowUp':
                light.position = light.position.add(new wre.Vec3(0.0, amount, 0.0));
                break;
            case 'ArrowDown':
                light.position = light.position.add(new wre.Vec3(0.0, -amount, 0.0));
                break;
            case 'ArrowLeft':
                light.position = light.position.add(new wre.Vec3(-amount, 0.0, 0.0));
                break;
            case 'ArrowRight':
                light.position = light.position.add(new wre.Vec3(amount, 0.0, 0.0));
                break;
            case ',':
                light.position = light.position.add(new wre.Vec3(0.0, 0.0, amount));
                break;
            case '.':
                light.position = light.position.add(new wre.Vec3(0.0, 0.0, -amount));
                break;
            case ' ':
                console.log(`Light Position: ${light.position.to_string()}`);
                break;
            default:
                break;
        }
        wre.set_point_light(1, light);
    }

    start() {
        // document.addEventListener('keydown', (evt) => this.keyHandler(evt));
        this._time = 0.0;
        this._frequency = 50.0;
        this._amplitude = 0.01;
    }

    update() {
        let dtSec = wre.time_dt().nanos / 10e9;
        this._time += dtSec;

        // Generate noise from -1.0 to 1.0
        let sinusoid = Math.sin(this._frequency * this._time);

        // 18 lights in the scene
        for (let i = 1; i < 18; i++) {
            let noise = Math.random() * 2.0 - 1.0;
            let yPerturb = (sinusoid + noise) * this._amplitude;

            let light = wre.get_point_light(i);
            light.position = light.position.add(new wre.Vec3(0.0, yPerturb, 0.0));
            wre.set_point_light(i, light);
        }
    }
}
