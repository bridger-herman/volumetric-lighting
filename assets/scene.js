/* scene.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Loads scenes from JSON file
 */

import * as wre from './pkg/wre_wasm.js'
import { loadTextResource, loadImage, WreScript, DEFAULT_SHADER_ID } from './wre.js'
import { MoveTest } from './user-scripts/moveTest.js'
import { BoardManager } from './user-scripts/BoardManager.js'

export async function loadSceneAsync(scenePath) {
    let sceneText = await loadTextResource(scenePath);
    let sceneObj = JSON.parse(sceneText);
    for (let i in sceneObj.scene) {
        let sceneEntity = sceneObj.scene[i];

        if (typeof sceneEntity.texture !== 'undefined') {
            let dataUrl = await loadImage(sceneEntity.texture);
            var texId = wre.add_texture(dataUrl);
        }

        let prefab = sceneObj.prefabs[sceneEntity.prefab];

        let eid = wre.create_entity();
        let entity = wre.get_entity(eid);
        let tf = entity.transform;

        tf.position = new wre.Vec3(
            sceneEntity.position[0],
            sceneEntity.position[1],
            sceneEntity.position[2],
        );
        tf.rotation = wre.Quat.from_rotation_ypr(
            sceneEntity.rotation[1],
            sceneEntity.rotation[0],
            sceneEntity.rotation[2],
        );
        tf.scale = new wre.Vec3(
            sceneEntity.scale[0],
            sceneEntity.scale[1],
            sceneEntity.scale[2],
        );


        entity.material = new wre.Material(DEFAULT_SHADER_ID, new wre.Vec4(
            sceneEntity.color[0],
            sceneEntity.color[1],
            sceneEntity.color[2],
            sceneEntity.color[3],
        ), texId);
        entity.transform = tf;
        wre.set_entity(eid, entity);

        loadTextResource(prefab.mesh).then((objText) => {
            if (typeof prefab.mesh !== 'undefined') {
                wre.add_mesh(eid, objText);
            }
        }).then(() => {
            for (let s in prefab.scripts) {
                // TODO: This is incredibly unsafe. How to best do
                // this?
                let ScriptClass = eval(prefab.scripts[s]);
                let script = new ScriptClass(eid);
                wre.add_script(eid, script);
            }
        });
    }
}
