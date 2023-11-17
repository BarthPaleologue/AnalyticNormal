import {Effect, ShaderMaterial} from "@babylonjs/core";

import normalFragment from "../../shaders/normalFragment.glsl";
import normalVertex from "../../shaders/normalVertex.glsl";
import {Scene} from "@babylonjs/core/scene";

Effect.ShadersStore["normalVertexShader"] = normalVertex;
Effect.ShadersStore["normalFragmentShader"] = normalFragment;

export function createNormalMaterial(scene: Scene) {
    return new ShaderMaterial("normalMaterial", scene, {
        vertex: "normal",
        fragment: "normal",
    }, {
        attributes: ["position", "normal"],
        uniforms: ["worldViewProjection", "world"]
    });
}