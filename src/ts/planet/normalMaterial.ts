import {Effect, ShaderMaterial} from "@babylonjs/core";

import normalFragment from "../../shaders/normalFragment.glsl";
import normalVertex from "../../shaders/normalVertex.glsl";
import {Scene} from "@babylonjs/core/scene";

export function createNormalMaterial(scene: Scene) {
    Effect.ShadersStore["normalVertexShader"] = normalVertex;
    Effect.ShadersStore["normalFragmentShader"] = normalFragment;

    const material = new ShaderMaterial("normalMaterial", scene, {
        vertex: "normal",
        fragment: "normal",
    }, {
        attributes: ["position", "normal"],
        uniforms: ["worldViewProjection", "world"]
    });

    return material;
}