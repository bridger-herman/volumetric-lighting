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
    start() {
        this.currentRotation = 0.0;
    }

    // To be implemented by inheriters
    update() {
        this.currentRotation += 0.01;
        this.transform.rotation = glm.vec3(0.0, this.currentRotation, 0.0);
    }
}

