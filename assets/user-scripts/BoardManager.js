/* BoardManager.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Creates a board from a list of locations, then manages clicks on the board
 */

import * as wre from '../pkg/wre_wasm.js';
import { WreScript, loadResource } from '../wre.js';

export class BoardManager extends WreScript {
    start() {
        let colors = {
            "red": [0.584314, 0.109804, 0.0745098, 1.0],
            "orange": [0.666667, 0.278431, 0.0235294, 1.0],
            "yellow": [0.627451, 0.588235, 0.0117647, 1.0],
            "lightGreen": [0.239216, 0.435294, 0.00392157, 1.0],
            "darkGreen": [0.0313726, 0.243137, 0.0156863, 1.0],
            "lightBlue": [0.509804, 0.611765, 0.709804, 1.0],
            "darkBlue": [0.121569, 0.345098, 0.596078, 1.0],
            "lightPurple": [0.45098, 0.380392, 0.560784, 1.0],
            "darkPurple": [0.2, 0.0823529, 0.317647, 1.0],
        }
        let board = {
            "red": [[1, 6], [5, 1], [7, 8], [8, 3]],
            "orange": [[0, 4], [2, 2], [3, 1], [6, 6]],
            "yellow": [[0, 6], [1, 0], [2, 3], [3, 2], [5, 8], [8, 4]],
            "lightGreen": [[2, 6], [3, 7], [6, 5]],
            "darkGreen": [[2, 1], [6, 2], [8, 7]],
            "lightBlue": [[2, 0], [5, 5], [8, 2]],
            "darkBlue": [[0, 1], [3, 3], [5, 7], [7, 2]],
            "lightPurple": [[0, 3], [3, 6], [5, 2], [6, 7], [8, 5]],
            "darkPurple": [[0, 5], [3, 0], [5, 6], [6, 8]],
        };
        loadResource('/resources/models/small_sphere.obj').then((objText) => {
            for (let color in board) {
                for (let pairIndex in board[color]) {
                    let sphere = wre.create_entity();
                    wre.add_mesh(sphere, objText);
                    let script = new WreScript();
                    script.transform.position = glm.add(
                        glm.mul(glm.vec3(0.0, 0.0, 0.1), board[color][pairIndex][0]),
                        glm.mul(glm.vec3(0.1, 0.0, 0.0), board[color][pairIndex][1])
                    );
                    script.transform.position = glm.sub(
                        script.transform.position,
                        glm.vec3(0.4, 0.0, 0.4),
                    );
                    wre.add_script(sphere, script);
                    wre.set_color(sphere, colors[color]);
                }
            }
        })
    }

    update() {
    }
}

