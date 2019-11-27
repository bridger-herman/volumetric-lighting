// mesh.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Only a container for data; passes self off to RenderSystem immediately

use std::fmt;
use std::io::BufReader;

use obj::{Obj, SimplePolygon};
use web_sys::{WebGl2RenderingContext, WebGlVertexArrayObject};

use crate::entity::EntityId;

pub struct Mesh {
    pub attached_to: Option<EntityId>,

    pub num_vertices: i32,

    pub vao: WebGlVertexArrayObject,
}

impl fmt::Debug for Mesh {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Mesh(attached_to: {0:?})", self.attached_to)
    }
}

impl Mesh {
    pub fn from_obj_str(obj_text: &str) -> Self {
        // Load the obj from a string
        let mut reader = BufReader::new(obj_text.as_bytes());
        let obj_file: Obj<SimplePolygon> =
            Obj::load_buf(&mut reader).expect("Unable to load obj file");

        // Collect the positions into triangles
        // TODO assuming only one group per object, and only one object per file
        let mut pos = vec![];
        for tri in &obj_file.objects[0].groups[0].polys {
            pos.push(obj_file.position[tri[0].0]);
            pos.push(obj_file.position[tri[1].0]);
            pos.push(obj_file.position[tri[2].0]);
        }
        let pos_flat: Vec<_> = pos.iter().flatten().cloned().collect();

        // Collect the normals into triangles
        // TODO assuming only one group per object, and only one object per file
        let mut norm = vec![];
        for tri in &obj_file.objects[0].groups[0].polys {
            norm.push(obj_file.normal[tri[0].2.unwrap()]);
            norm.push(obj_file.normal[tri[1].2.unwrap()]);
            norm.push(obj_file.normal[tri[2].2.unwrap()]);
        }
        let norm_flat: Vec<_> = norm.iter().flatten().cloned().collect();

        // Collect the uv's into triangles
        // TODO assuming only one group per object, and only one object per file
        let mut uv = vec![];
        for tri in &obj_file.objects[0].groups[0].polys {
            uv.push(obj_file.texture[tri[0].1.unwrap()]);
            uv.push(obj_file.texture[tri[1].1.unwrap()]);
            uv.push(obj_file.texture[tri[2].1.unwrap()]);
        }
        let uv_flat: Vec<_> = uv.iter().flatten().cloned().collect();

        let vao = wre_gl!()
            .create_vertex_array()
            .expect("failed to create vao");
        wre_gl!().bind_vertex_array(Some(&vao));

        let vert_vbo = wre_gl!()
            .create_buffer()
            .expect("failed to create vert_vbo");
        wre_gl!()
            .bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&vert_vbo));

        // Note that `Float32Array::view` is somewhat dangerous (hence the
        // `unsafe`!). This is creating a raw view into our module's
        // `WebAssembly.Memory` buffer, but if we allocate more pages for ourself
        // (aka do a memory allocation in Rust) it'll cause the buffer to change,
        // causing the `Float32Array` to be invalid.
        //
        // As a result, after `Float32Array::view` we have to be very careful not to
        // do any memory allocations before it's dropped.
        unsafe {
            let vert_array = js_sys::Float32Array::view(&pos_flat);

            wre_gl!().buffer_data_with_array_buffer_view(
                WebGl2RenderingContext::ARRAY_BUFFER,
                &vert_array,
                WebGl2RenderingContext::STATIC_DRAW,
            );
        }

        wre_gl!().enable_vertex_attrib_array(0);
        wre_gl!().vertex_attrib_pointer_with_i32(
            0,
            3,
            WebGl2RenderingContext::FLOAT,
            false,
            0,
            0,
        );

        let norm_vbo = wre_gl!()
            .create_buffer()
            .expect("failed to create norm_vbo");
        wre_gl!()
            .bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&norm_vbo));

        unsafe {
            let norm_array = js_sys::Float32Array::view(&norm_flat);

            wre_gl!().buffer_data_with_array_buffer_view(
                WebGl2RenderingContext::ARRAY_BUFFER,
                &norm_array,
                WebGl2RenderingContext::STATIC_DRAW,
            );
        }

        wre_gl!().enable_vertex_attrib_array(1);
        wre_gl!().vertex_attrib_pointer_with_i32(
            1,
            3,
            WebGl2RenderingContext::FLOAT,
            false,
            0,
            0,
        );

        let uv_vbo =
            wre_gl!().create_buffer().expect("failed to create uv_vbo");
        wre_gl!()
            .bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&uv_vbo));

        unsafe {
            let uv_array = js_sys::Float32Array::view(&uv_flat);

            wre_gl!().buffer_data_with_array_buffer_view(
                WebGl2RenderingContext::ARRAY_BUFFER,
                &uv_array,
                WebGl2RenderingContext::STATIC_DRAW,
            );
        }

        wre_gl!().enable_vertex_attrib_array(2);
        wre_gl!().vertex_attrib_pointer_with_i32(
            2,
            2,
            WebGl2RenderingContext::FLOAT,
            false,
            0,
            0,
        );

        Self {
            attached_to: None,
            num_vertices: (pos_flat.len() / 3) as i32,
            vao,
        }
    }
}
