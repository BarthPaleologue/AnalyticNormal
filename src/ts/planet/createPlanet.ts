import { Scene } from "@babylonjs/core/scene";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Direction, PlanetChunk } from "./planetChunk";
import {createNormalMaterial} from "./normalMaterial";

export class Planet {
    readonly node: TransformNode;
    readonly chunks: PlanetChunk[];

    constructor(radius: number, useAnalyticNormal: boolean, scene: Scene) {
        this.node = new TransformNode("planet", scene);

        this.chunks = [
            new PlanetChunk(Direction.TOP, radius, useAnalyticNormal, scene),
            new PlanetChunk(Direction.BOTTOM, radius, useAnalyticNormal, scene),
            new PlanetChunk(Direction.LEFT, radius, useAnalyticNormal, scene),
            new PlanetChunk(Direction.RIGHT, radius, useAnalyticNormal, scene),
            new PlanetChunk(Direction.FRONT, radius, useAnalyticNormal, scene),
            new PlanetChunk(Direction.BACK, radius, useAnalyticNormal, scene)
        ];

        const material = createNormalMaterial(scene);

        this.chunks.forEach(chunk => {
            chunk.mesh.parent = this.node;
            chunk.mesh.material = material;
        });
    }
}