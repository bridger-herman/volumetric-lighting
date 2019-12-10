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
    start() {
    }

    update() {
        let light = wre.get_point_light(0);
        light.position = light.position.add(new wre.Vec3(0.0, 0.01, 0.0));
        wre.set_point_light(0, light);

        let spotLight = wre.get_spot_light(0);
        spotLight.position = spotLight.position.add(new wre.Vec3(0.01, 0.0, 0.0));
        wre.set_spot_light(0, spotLight);
    }
}
