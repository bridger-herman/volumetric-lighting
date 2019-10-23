/* moveTest.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Base class for a JS script that can be attached to an Entity
 */

import { WreScript } from '../wre-js/wreScript.js'
import * as wre from '../pkg/wre_wasm.js';

export class MoveTest extends WreScript {
    // To be implemented by inheriters
    update() {
        let scale = 1.01;
        let mat = this._entity.transform.matrix;
        mat[0] *= scale;
        mat[5] *= scale;
        mat[10] *= scale;
    }
}

