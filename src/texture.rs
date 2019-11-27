//! Encapsulates work of loading a texture from an image file
//! Only ASCII PPMs (P3) are supported in this project.

use std::io::BufReader;

use web_sys::{WebGl2RenderingContext, WebGlTexture};

use png;

pub type TextureId = usize;

/// Represents an image texture
#[derive(Debug)]
pub struct Texture {
    pub tex: WebGlTexture,
    pub id: TextureId,
}

unsafe impl Send for Texture {}

impl Texture {
    /// Load an image from png bytes
    /// Given a texture ID from the Render System
    pub fn init_from_image(id: TextureId, png_bytes: &[u8]) -> Self {
        // Set up the texture
        let tex = wre_gl!().create_texture();
        if tex.is_none() {
            error_panic!("Invalid WebGl texture");
        }
        wre_gl!().active_texture(WebGl2RenderingContext::TEXTURE0);
        wre_gl!()
            .bind_texture(WebGl2RenderingContext::TEXTURE_2D, tex.as_ref());

        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_WRAP_S,
            WebGl2RenderingContext::REPEAT as i32,
        );
        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_WRAP_T,
            WebGl2RenderingContext::REPEAT as i32,
        );
        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MIN_FILTER,
            WebGl2RenderingContext::NEAREST as i32,
        );
        wre_gl!().tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MAG_FILTER,
            WebGl2RenderingContext::NEAREST as i32,
        );

        // Decode the png bytes
        let reader = BufReader::new(png_bytes);
        let decoder = png::Decoder::new(reader);
        let (png_info, mut reader) =
            decoder.read_info().unwrap_or_else(|err| {
                error_panic!("Unable to decode png: {:?}", err);
            });
        let mut buf = vec![0; png_info.buffer_size()];
        reader.next_frame(&mut buf).unwrap_or_else(|err| {
            error_panic!("Unable to read png: {:?}", err);
        });

        wre_gl!().
            tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array
        (
            WebGl2RenderingContext::TEXTURE_2D,
            0,
            WebGl2RenderingContext::RGBA as i32,
            png_info.width as i32,
            png_info.height as i32,
            0,
            WebGl2RenderingContext::RGBA,
            WebGl2RenderingContext::UNSIGNED_BYTE,
            Some(&buf)
        ).unwrap_or_else(|err| {
            error_panic!("Unable to create tex_image_2d: {:?}", err);
        });
        // unsafe {
        // gl::GenerateMipmap(gl::TEXTURE_2D);
        // }

        Texture {
            tex: tex.unwrap(),
            id,
        }
    }
}

impl Drop for Texture {
    fn drop(&mut self) {
        wre_gl!().delete_texture(Some(&self.tex));
    }
}
