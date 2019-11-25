/* scene.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Loads scenes from JSON file
 */

import * as wre from './pkg/wre_wasm.js'
import { loadTextResource, loadImage, WreScript, DEFAULT_SHADER_ID, SHADERS } from './wre.js'

export async function loadSceneAsync(scenePath) {
    let sceneText = await loadTextResource(scenePath);
    let sceneObj = JSON.parse(sceneText);
    for (let i in sceneObj.scene) {
        let sceneEntity = sceneObj.scene[i];

        if (typeof sceneEntity.texture !== 'undefined') {
            // Check if the texture already exists
            var texId = wre.get_texture_id_by_path(sceneEntity.texture);
            if (typeof texId === 'undefined') {
                let dataUrl = await loadImage(sceneEntity.texture);
                var texId = wre.add_texture(sceneEntity.texture, dataUrl);
            }
        }

        let prefab = sceneObj.prefabs[sceneEntity.prefab];

        let eid = wre.create_entity();
        let entity = wre.get_entity(eid);
        let tf = entity.transform;

        if (typeof sceneEntity.position !== 'undefined') {
            tf.position = new wre.Vec3(
                sceneEntity.position[0],
                sceneEntity.position[1],
                sceneEntity.position[2],
            );
        }
        if (typeof sceneEntity.rotation !== 'undefined') {
            tf.rotation = wre.Quat.from_rotation_ypr(
                sceneEntity.rotation[1],
                sceneEntity.rotation[0],
                sceneEntity.rotation[2],
            );
        }
        if (typeof sceneEntity.scale !== 'undefined') {
            tf.scale = new wre.Vec3(
                sceneEntity.scale[0],
                sceneEntity.scale[1],
                sceneEntity.scale[2],
            );
        }

        let color = wre.Vec4.zero();
        if (typeof sceneEntity.color !== 'undefined') {
            color = new wre.Vec4(
                sceneEntity.color[0],
                sceneEntity.color[1],
                sceneEntity.color[2],
                sceneEntity.color[3],
            );
        }

        let shader = DEFAULT_SHADER_ID;
        if (typeof(sceneEntity.shader) !== 'undefined') {
            shader = SHADERS.indexOf(sceneEntity.shader);
        }

        console.log(`Using shader ${shader} for entity ${eid}`);
        entity.material = new wre.Material(shader, color, null, texId);
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

    // Add all the lights to the scene (position and color)
    for (let l in sceneObj.lights) {
        let light = sceneObj.lights[l];
        wre.add_light(
            new wre.Vec3(light.position[0], light.position[1], light.position[2]),
            new wre.Vec3(light.color[0], light.color[1], light.color[2]),
        );
    }

    if (typeof(sceneObj.camera) !== 'undefined') {
        let pos = new wre.Vec3(
            sceneObj.camera.position[0],
            sceneObj.camera.position[1],
            sceneObj.camera.position[2],
        );
        wre.set_camera_position(pos);
    }
}
