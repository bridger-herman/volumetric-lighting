/* scene.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Loads scenes from JSON file
 */

import * as wre from './pkg/wre_wasm.js'
import { loadResource } from './wre.js'
import { MoveTest } from './user-scripts/moveTest.js'

export class Scene {
    static loadSceneAsync(scenePath) {
        return loadResource(scenePath).then((sceneText) => {
            let sceneObj = JSON.parse(sceneText);
            for (let i in sceneObj.scene) {
                let sceneEntity = sceneObj.scene[i];
                let prefab = sceneObj.prefabs[sceneEntity.prefab];

                let eid = wre.create_entity();
                wre.set_color(eid, sceneEntity.color);
                loadResource(prefab.mesh).then((objText) => {
                    wre.add_mesh(eid, objText);
                    for (let s in prefab.scripts) {
                        // TODO: This is incredibly unsafe. How to best do
                        // this?
                        let ScriptClass = eval(prefab.scripts[s]);
                        let script = new ScriptClass;

                        script.transform.position = glm.vec3(
                            sceneEntity.position[0],
                            sceneEntity.position[1],
                            sceneEntity.position[2],
                        );
                        script.transform.rotation = glm.vec3(
                            sceneEntity.rotation[0],
                            sceneEntity.rotation[1],
                            sceneEntity.rotation[2],
                        );
                        script.transform.scale = glm.vec3(
                            sceneEntity.scale[0],
                            sceneEntity.scale[1],
                            sceneEntity.scale[2],
                        );

                        wre.add_script(eid, script);
                    }
                });
            }
        });
    }
}
