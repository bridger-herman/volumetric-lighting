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
    }

    update() {
    }
}
