/* moveTest.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Base class for a JS script that can be attached to an Entity
 */

import * as wre from '../pkg/wre_wasm.js';
import { WreScript } from '../wre.js';

export class MoveTest extends WreScript {
    // To be implemented by inheriters
    update() {
        let deltaScale = 1.01;
        this.transform.scale = glm.mul(this.transform.scale, deltaScale);
    }
}

