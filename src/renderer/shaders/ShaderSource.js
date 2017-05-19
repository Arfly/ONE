import model_vtex from './glsl/model_vtex.glsl';
import model_frag from './glsl/model_frag.glsl';

import model_texture_vtex from './glsl/model_texture_vtex.glsl';
import model_texture_frag from './glsl/model_texture_frag.glsl';

import model_texture_camera_vtex from './glsl/model_texture_camera_vtex.glsl';
import model_texture_camera_frag from './glsl/model_texture_camera_frag.glsl';

var ShaderSource = {

    model_vtex: model_vtex,
    model_frag: model_frag,

    model_texture_vtex: model_texture_vtex,
    model_texture_frag: model_texture_frag,

    model_texture_camera_vtex: model_texture_camera_vtex,
    model_texture_camera_frag: model_texture_camera_frag

}

export { ShaderSource };