// frame_buffer.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Encapsulates a WebGL frame buffer

use web_sys::{
    WebGl2RenderingContext, WebGlFramebuffer, WebGlProgram, WebGlTexture,
};

use crate::mesh::Mesh;
use crate::window::DEFAULT_WINDOW_SIZE;

const SCREEN_QUAD_OBJ: &str = "
v -1.000000 -1.000000 0.000000
v 1.000000 -1.000000 0.000000
v -1.000000 1.000000 0.000000
v 1.000000 1.000000 0.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 1.000000 1.000000
vn 0.0000 0.0000 1.0000
f 2/1/1 3/2/1 1/3/1
f 2/1/1 4/4/1 3/2/1
";

pub struct FrameBuffer {
    fbo: WebGlFramebuffer,
    screen_texture: WebGlTexture,
    screen_quad_mesh: Mesh,
}

impl FrameBuffer {
    pub fn bind(&self) {
        // wre_gl!().enable(WebGl2RenderingContext::CULL_FACE);
        wre_gl!().bind_framebuffer(
            WebGl2RenderingContext::FRAMEBUFFER,
            Some(&self.fbo),
        );
    }

    pub fn unbind(&self) {
        wre_gl!().bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);
        // wre_gl!().disable(WebGl2RenderingContext::CULL_FACE);
    }

    pub fn render(&self, screen_quad_shader: &WebGlProgram) {
        wre_gl!().bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);

        // Disable depth testing for screen-space quad drawing
        wre_gl!().depth_mask(false);
        wre_gl!().disable(WebGl2RenderingContext::DEPTH_TEST);

        // Set the viewport (because texture might be different size from window)
        let (width, height) = DEFAULT_WINDOW_SIZE;
        wre_gl!().viewport(0, 0, width as i32, height as i32);

        wre_gl!().use_program(Some(screen_quad_shader));
        wre_gl!().bind_vertex_array(Some(&self.screen_quad_mesh.vao));

        wre_gl!().active_texture(WebGl2RenderingContext::TEXTURE1);
        wre_gl!().bind_texture(
            WebGl2RenderingContext::TEXTURE_2D,
            Some(&self.screen_texture),
        );

        // Send the rendered texture to the graphics card
        let image_uniform_location =
            wre_gl!().get_uniform_location(screen_quad_shader, "uni_image");
        wre_gl!().uniform1i(image_uniform_location.as_ref(), 1);

        wre_gl!().draw_arrays(WebGl2RenderingContext::TRIANGLES, 0, 6);

        wre_gl!().depth_mask(true);
        wre_gl!().enable(WebGl2RenderingContext::DEPTH_TEST);

        wre_gl!().bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);
        wre_gl!().use_program(None);
    }
}

impl Default for FrameBuffer {
    fn default() -> Self {
        let screen_quad_mesh = Mesh::from_obj_str(SCREEN_QUAD_OBJ);

        // Create the framebuffer texture
        let screen_texture = wre_gl!().create_texture();
        if screen_texture.is_none() {
            error!("Invalid texture");
        }

        wre_gl!().active_texture(WebGl2RenderingContext::TEXTURE1);
        wre_gl!().bind_texture(
            WebGl2RenderingContext::TEXTURE_2D,
            screen_texture.as_ref(),
        );

        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_WRAP_S,
            WebGl2RenderingContext::CLAMP_TO_EDGE as i32,
        );
        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_WRAP_T,
            WebGl2RenderingContext::CLAMP_TO_EDGE as i32,
        );
        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MIN_FILTER,
            WebGl2RenderingContext::LINEAR as i32,
        );
        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MAG_FILTER,
            WebGl2RenderingContext::LINEAR as i32,
        );

        // Initialize the empty frame buffer texture
        let (width, height) = DEFAULT_WINDOW_SIZE;
        wre_gl!().
            tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array
        (
            WebGl2RenderingContext::TEXTURE_2D,
            0,
            WebGl2RenderingContext::RGBA as i32,
            width as i32,
            height as i32,
            0,
            WebGl2RenderingContext::RGBA,
            WebGl2RenderingContext::UNSIGNED_BYTE,
            None,
        ).unwrap();

        // Create the framebuffer
        let fbo = wre_gl!()
            .create_framebuffer()
            .expect("Unable to create framebuffer");
        wre_gl!()
            .bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&fbo));
        wre_gl!().framebuffer_texture_2d(
            WebGl2RenderingContext::FRAMEBUFFER,
            WebGl2RenderingContext::COLOR_ATTACHMENT0,
            WebGl2RenderingContext::TEXTURE_2D,
            screen_texture.as_ref(),
            0,
        );

        // Attach to framebuffer
        let buffers = [WebGl2RenderingContext::COLOR_ATTACHMENT0];
        unsafe {
            let buffer_array = js_sys::Uint32Array::view(&buffers);
            wre_gl!().draw_buffers(&buffer_array);
        }

        // Create the render buffer to store the frame buffer
        let rbo = wre_gl!()
            .create_renderbuffer()
            .expect("Unable to create render buffer");
        wre_gl!().bind_renderbuffer(
            WebGl2RenderingContext::RENDERBUFFER,
            Some(&rbo),
        );
        wre_gl!().renderbuffer_storage(
            WebGl2RenderingContext::RENDERBUFFER,
            WebGl2RenderingContext::DEPTH_COMPONENT16,
            width as i32,
            height as i32,
        );
        wre_gl!().framebuffer_renderbuffer(
            WebGl2RenderingContext::FRAMEBUFFER,
            WebGl2RenderingContext::DEPTH_ATTACHMENT,
            WebGl2RenderingContext::RENDERBUFFER,
            Some(&rbo),
        );

        let status = wre_gl!()
            .check_framebuffer_status(WebGl2RenderingContext::FRAMEBUFFER);
        if status != WebGl2RenderingContext::FRAMEBUFFER_COMPLETE {
            error!("Framebuffer is incomplete: {:#06x}", status);
            panic!();
        }

        wre_gl!().bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);

        Self {
            fbo,
            screen_quad_mesh,
            screen_texture: screen_texture.unwrap(),
        }
    }
}
