/* placeToken.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Animate the placing of a token onto the board
 */

import * as wre from '../pkg/wre_wasm.js';
import { WreScript, loadResource } from '../wre.js';

export class PlaceToken extends WreScript {
    start() {
        this._keyframes = {
            0.0: wre.Transform.identity(),
            1.0: wre.Transform.identity(),
        };

        this.updateKeyframeArray();

        // Frame duration
        this._duration = 30.0;
        this._currentFrame = 0;
    }

    updateKeyframeArray() {
        this._keyframeArray = [];
        for (let k in this._keyframes) {
            this._keyframeArray.push([k, this._keyframes[k]]);
        }
        this._keyframeArray.sort();
    }

    update() {
        let t = this._currentFrame / this._duration;
        let previousKeyframeIndex = 0;
        let nextKeyframeIndex = 0;
        for (let i in this._keyframeArray) {
            let keyframeT = this._keyframeArray[i][0];
            let tf = this._keyframeArray[i][1];
            if (keyframeT > t) {
                nextKeyframeIndex = i;
                break;
            }
            previousKeyframeIndex = i;
        }

        let previousKeyframeT = this._keyframeArray[previousKeyframeIndex][0];
        let nextKeyframeT = this._keyframeArray[nextKeyframeIndex][0];
        let previousKeyframe = this._keyframeArray[previousKeyframeIndex][1];
        let nextKeyframe = this._keyframeArray[nextKeyframeIndex][1];

        let intermediateT = (t - previousKeyframeT) / (nextKeyframeT - previousKeyframeT);

        if (t > 1.0) {
            this.transform = this._keyframes[1.0];
        } else if (t < 0.0) {
            this.transform = this._keyframes[0.0];
        } else {
            this.transform = previousKeyframe.lerp(nextKeyframe, intermediateT);
        }
        this._currentFrame += 1;
    }

    setKeyframe(tf, t) {
        this._keyframes[t] = tf;
        this.updateKeyframeArray();
    }
}
