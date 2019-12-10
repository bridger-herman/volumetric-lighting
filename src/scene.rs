// scene.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! A scene, specified by a json file

use std::collections::HashMap;

use glam::{Quat, Vec3};
use wasm_bindgen::prelude::*;

use crate::entity::EntityId;
use crate::light::{PointLight, SpotLight};
use crate::material::Material;
use crate::mesh::Mesh;
use crate::resources::{load_image_resource, load_text_resource};
use crate::script_manager::WreScript;
use crate::shader::{load_shader, Shader};
use crate::texture::Texture;
use crate::transform::Transform;

#[wasm_bindgen(module = "/assets/loadWreScript.js")]
extern "C" {
    #[wasm_bindgen]
    pub fn loadWreScript(name: &str, eid: EntityId) -> WreScript;
}

/// A prefab loaded from the scene file
#[derive(Debug, Serialize, Deserialize)]
struct JsonPrefab {
    /// Path to the mesh that should be drawn
    mesh: Option<String>,

    /// Names of the scripts that should be attached to this prefab
    scripts: Vec<String>,

    /// Name of the shader that should be used to render this object
    shader: Option<String>,
}

/// Each entity in the scene file. Optional fields are represented as `Option`
/// type
#[derive(Debug, Serialize, Deserialize)]
struct JsonEntity {
    /// The name of the prefab that this entity is made out of
    prefab: String,

    /// Position: part of transform
    position: Option<Vec3>,

    /// Rotation (xyz euler angles): part of transform
    rotation: Option<Vec3>,

    /// Scale: part of transform
    scale: Option<Vec3>,
}

/// Subset of user camera info defined in scene
#[derive(Debug, Serialize, Deserialize)]
pub struct JsonCamera {
    position: Vec3,
}

/// The scene file, loaded from JSON format
#[derive(Debug, Serialize, Deserialize)]
pub struct JsonScene {
    /// Prefabs that can be used in the scene
    prefabs: HashMap<String, JsonPrefab>,

    /// Lights in the scene
    point_lights: Vec<PointLight>,
    spot_lights: Vec<SpotLight>,

    /// Objects in the scene
    entities: Vec<JsonEntity>,

    /// User camera information
    camera: JsonCamera,
}

/// The actual scene, containing all the de-duplicated resources loaded into WRE
/// format (entities, meshes, textures)
#[derive(Debug, Default)]
pub struct Scene {
    /// Prefabs that are available to entities in the scene
    prefabs: HashMap<String, JsonPrefab>,

    /// All the point lights in the scene
    pub point_lights: Vec<PointLight>,
    pub spot_lights: Vec<SpotLight>,

    /// The meshes in the scene (path, Mesh)
    pub meshes: HashMap<String, Mesh>,

    /// The textures in the scene (path, Texture)
    pub textures: HashMap<String, Texture>,

    /// The obj materials available
    pub materials: HashMap<String, Material>,

    /// The shaders that this scene's materials use (name, Shader)
    pub shaders: HashMap<String, Shader>,
}

impl Scene {
    pub fn get_shader_by_id(&self, shader_id: usize) -> Option<&Shader> {
        if let Some((_name, shader)) =
            self.shaders.iter().find(|(_n, s)| s.id == shader_id)
        {
            Some(&shader)
        } else {
            None
        }
    }

    pub fn get_texture_by_id(&self, texture_id: usize) -> Option<&Texture> {
        if let Some((_name, texture)) =
            self.textures.iter().find(|(_n, t)| t.id == texture_id)
        {
            Some(&texture)
        } else {
            None
        }
    }
}

#[wasm_bindgen]
pub async fn load_scene_async(scene_path: String) -> Result<(), JsValue> {
    let scene_text_js = load_text_resource(scene_path.clone()).await?;
    let scene_text_string = scene_text_js.as_string().unwrap_or_else(|| {
        error_panic!("Unable to convert to string");
    });

    // Load the scene using serde
    let json_scene: JsonScene = serde_json::from_str(&scene_text_string)
        .unwrap_or_else(|err| {
            error_panic!("Unable to parse scene with serde: {:?}", err);
        });

    // Default scene (populated by contents of json scene)
    let mut scene = Scene::default();

    // Move the lights over
    scene.point_lights = json_scene.point_lights;
    scene.spot_lights = json_scene.spot_lights;

    // Convert spot light radians
    for s in scene.spot_lights.iter_mut() {
        s.angle_inside = s.angle_inside.to_radians();
        s.angle_outside = s.angle_outside.to_radians();
    }

    // Load all the information about the prefabs (meshes, materials, shaders)
    for (_name, prefab) in json_scene.prefabs.iter() {
        // Don't load any shaders twice
        let shader_name =
            prefab.shader.clone().unwrap_or("phong_forward".to_string());
        if scene.shaders.get(&shader_name).is_none() {
            let shader = load_shader(&shader_name, scene.shaders.len()).await?;
            scene.shaders.insert(shader_name.clone(), shader);
        }

        if let Some(mesh) = &prefab.mesh {
            // Don't load any mesh twice
            if scene.meshes.get(mesh).is_none() {
                let obj_text_js = load_text_resource(mesh.clone()).await?;
                let obj_text = obj_text_js.as_string().unwrap_or_else(|| {
                    error_panic!("Unable to convert obj to string");
                });

                scene
                    .meshes
                    .insert(mesh.clone(), Mesh::from_obj_str(&obj_text));
                trace!("Loaded mesh {}", mesh);

                // Find the texture(s) associated with this object's material
                let mtl_name = mesh.replace("obj", "mtl");
                let mtl_text_js = load_text_resource(mtl_name.clone()).await?;
                let mtl_text = mtl_text_js.as_string().unwrap_or_else(|| {
                    error_panic!("Unable to convert mtl to string");
                });
                let texture_name = mtl_text
                    .lines()
                    .find(|line| line.to_lowercase().starts_with("map_kd"));

                let tex_id = if let Some(name) = texture_name {
                    // Mutate the texture name so it can be found on the server
                    let path = format!(
                        "./resources/textures/{}",
                        name.split_whitespace().collect::<Vec<_>>()[1]
                    );

                    // And only load the texture if it's not already there
                    if let Some(tex) = scene.textures.get(&path) {
                        Some(tex.id)
                    } else {
                        let tex_id = scene.textures.len();
                        let img_js = load_image_resource(path.clone()).await?;

                        let mut bytes = vec![0u8; img_js.length() as usize];
                        img_js.copy_to(&mut bytes);
                        scene.textures.insert(
                            path.clone(),
                            Texture::init_from_image(tex_id, &bytes),
                        );
                        trace!("Loaded texture {}", path);
                        Some(tex_id)
                    }
                } else {
                    None
                };

                let mut material = Material::from_mtl_str(&mtl_text);
                material.set_texture_id(tex_id);
                material.shader_id = scene.shaders[&shader_name].id;
                scene.materials.insert(mtl_name.clone(), material);
                trace!("Loaded material {}", mtl_name);
            }
        }
    }

    // Move the prefabs over to the scene
    scene.prefabs = json_scene.prefabs;

    // Populate the scene with entities
    for entity in &json_scene.entities {
        let rotation = entity.rotation.unwrap_or_default();
        let transform = Transform::new(
            entity.position.unwrap_or_default(),
            Quat::from_rotation_ypr(rotation.y(), rotation.z(), rotation.x()),
            entity.scale.unwrap_or(Vec3::one()),
        );

        let eid = wre_entities!().create();
        wre_entities_mut!(eid).set_transform(&transform);
        trace!("Initializing entity {}", eid);

        // Connect the mesh with this entity
        if let Some(mesh_path) = &scene.prefabs[&entity.prefab].mesh {
            let mesh = scene.meshes.get_mut(mesh_path).unwrap_or_else(|| {
                error_panic!("Mesh {:?} not loaded from a prefab", mesh_path);
            });
            mesh.attached_to.push(eid);
            trace!("Attached mesh {:?} to entity {:?}", mesh_path, eid);

            // Add the material and connect it with the shader
            let mtl_path = mesh_path.replace("obj", "mtl");
            let material = scene.materials.get(&mtl_path).unwrap();
            wre_entities_mut!(eid).set_material(material);
            trace!("Attached material {:?} to entity {:?}", mtl_path, eid);
        }

        // Attach the scripts to this entity
        for script_name in &scene.prefabs[&entity.prefab].scripts {
            let script = loadWreScript(script_name, eid);
            wre_scripts!().add_script(eid, script);
            trace!("Attached script {:?} to entity {}", script_name, eid);
        }
    }

    // The post-processing shader must be loaded before the scene can be
    // rendered!
    wre_render_system!().load_post_processing_shader().await?;
    wre_render_system!().add_scene(scene);
    info!("Loaded Scene: {:?}", scene_path);

    Ok(())
}
