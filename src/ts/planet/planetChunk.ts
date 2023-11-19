import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import {showNormals} from "../debug";

export enum Direction {
    FRONT,
    BACK,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM
}

function rotationFromDirection(direction: Direction) {
    switch (direction) {
        case Direction.BACK:
            return Quaternion.RotationAxis(new Vector3(0, 1, 0), Math.PI);
        case Direction.LEFT:
            return Quaternion.RotationAxis(new Vector3(0, 1, 0), Math.PI / 2);
        case Direction.RIGHT:
            return Quaternion.RotationAxis(new Vector3(0, 1, 0), -Math.PI / 2);
        case Direction.TOP:
            return Quaternion.RotationAxis(new Vector3(1, 0, 0), Math.PI / 2);
        case Direction.BOTTOM:
            return Quaternion.RotationAxis(new Vector3(1, 0, 0), -Math.PI / 2);
        default:
            return Quaternion.Identity();
    }
}

export class PlanetChunk {
    readonly mesh: Mesh;

    constructor(direction: Direction, planetRadius: number, useAnalyticNormal: boolean, scene: Scene) {
        this.mesh = new Mesh("chunk", scene);

        const nbVerticesPerRow = 8;

        const positions = new Float32Array(nbVerticesPerRow * nbVerticesPerRow * 3);
        const normals = new Float32Array(nbVerticesPerRow * nbVerticesPerRow * 3);
        const indices = new Uint32Array((nbVerticesPerRow - 1) * (nbVerticesPerRow - 1) * 6);

        const size = planetRadius * 2;
        const stepSize = size / (nbVerticesPerRow - 1);

        const rotationQuaternion = rotationFromDirection(direction);

        const chunkPosition = new Vector3(0, 0, -size / 2);
        const rotatedChunkPosition = chunkPosition.applyRotationQuaternion(rotationQuaternion);

        this.mesh.position = rotatedChunkPosition;

        let indexIndex = 0;
        for (let x = 0; x < nbVerticesPerRow; x++) {
            for (let y = 0; y < nbVerticesPerRow; y++) {
                const index = x * nbVerticesPerRow + y;
                const positionX = x * stepSize - size / 2;
                const positionY = y * stepSize - size / 2;
                const positionZ = 0;

                const vertexPosition = chunkPosition.add(new Vector3(positionX, positionY, positionZ));
                vertexPosition.applyRotationQuaternionInPlace(rotationQuaternion);

                const vertexNormalToPlanet = vertexPosition.normalizeToNew();

                vertexPosition.copyFrom(vertexNormalToPlanet.scale(planetRadius));

                const [height, gradient] = terrainFunction(vertexNormalToPlanet, planetRadius);

                gradient.scaleInPlace(1 / (planetRadius + height));

                const projectedGradient = gradient.subtract(vertexNormalToPlanet.scale(Vector3.Dot(gradient, vertexNormalToPlanet)));

                vertexPosition.addInPlace(vertexNormalToPlanet.scale(height));
                vertexPosition.subtractInPlace(this.mesh.position);

                positions[3 * index + 0] = vertexPosition.x;
                positions[3 * index + 1] = vertexPosition.y;
                positions[3 * index + 2] = vertexPosition.z;

                const normal = vertexNormalToPlanet.subtract(projectedGradient).normalize();

                normals[3 * index + 0] = normal.x;
                normals[3 * index + 1] = normal.y;
                normals[3 * index + 2] = normal.z;

                if (x == 0 || y == 0) continue;

                indices[indexIndex++] = index - 1;
                indices[indexIndex++] = index;
                indices[indexIndex++] = index - nbVerticesPerRow - 1;

                indices[indexIndex++] = index;
                indices[indexIndex++] = index - nbVerticesPerRow;
                indices[indexIndex++] = index - nbVerticesPerRow - 1;
            }
        }

        const vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        if(useAnalyticNormal) vertexData.normals = normals;

        vertexData.applyToMesh(this.mesh);
        if(!useAnalyticNormal) this.mesh.createNormals(false);

        showNormals(this.mesh, planetRadius * 0.2, scene);
    }
}

function terrainFunction(position: Vector3, planetRadius: number): [height: number, grad: Vector3] {
    const heightMultiplier = 0.2 * planetRadius;
    const frequency = 8; // 2

    const height = Math.sin(position.y * frequency) * heightMultiplier;

    const gradX = 0;
    const gradY = Math.cos(position.y * frequency) * frequency * heightMultiplier;
    const gradZ = 0;

    return [height, new Vector3(gradX, gradY, gradZ)];
}