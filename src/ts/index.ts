import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Loading/loadingScreen";

import "../styles/index.scss";
import {Planet} from "./planet/createPlanet";
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import {Viewport} from "@babylonjs/core/Maths/math.viewport";

const canvas = document.getElementById("renderer") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);
engine.displayLoadingUI();

const scene = new Scene(engine);

const light1 = new DirectionalLight("light", new Vector3(0, 5, 10).negateInPlace().normalize(), scene);

const planetAnalytic = new Planet(4, true, scene);
planetAnalytic.node.position.x = 10;
planetAnalytic.node.getChildMeshes().forEach(mesh => {
    mesh.layerMask = 1;
});

const camera1 = new ArcRotateCamera("camera", 3.14 / 2, 3.14 / 2, 15, planetAnalytic.node.position, scene);
camera1.lowerAlphaLimit = 0 + 0.2;
camera1.upperAlphaLimit = 3.14 - 0.2;
camera1.lowerRadiusLimit = 10;
camera1.upperRadiusLimit = 30;
camera1.layerMask = 1;
camera1.attachControl(canvas, true);

const planetApprox = new Planet(4, false, scene);
planetApprox.node.position.x = -10;
planetApprox.node.getChildMeshes().forEach(mesh => {
    mesh.layerMask = 2;
});

const camera2 = new ArcRotateCamera("camera2", 3.14 / 2, 3.14 / 2, 15, planetApprox.node.position, scene);
camera2.lowerAlphaLimit = 0 + 0.2;
camera2.upperAlphaLimit = 3.14 - 0.2;
camera2.lowerRadiusLimit = 10;
camera2.upperRadiusLimit = 30;
camera2.layerMask = 2;
camera2.attachControl(canvas, true);

camera1.viewport = new Viewport(0, 0.0, 0.5, 1);
camera2.viewport = new Viewport(0.5, 0, 0.5, 1);

scene.activeCameras = [];
scene.activeCameras.push(camera1);
scene.activeCameras.push(camera2);

const uiScene = new Scene(engine);
uiScene.autoClear = false;
new ArcRotateCamera("uiCamera", 0, 0, 0, Vector3.Zero(), uiScene);

const ui = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, uiScene);

const analyticText = new TextBlock("analyticText", "Analytic normals");
analyticText.color = "white";
analyticText.fontSize = 24;
analyticText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
analyticText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
analyticText.left = window.innerWidth / 5;
analyticText.top = 30;
ui.addControl(analyticText);

const approxText = new TextBlock("approxText", "Approximated normals");
approxText.color = "white";
approxText.fontSize = 24;
approxText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
approxText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
approxText.left = -window.innerWidth / 5;
approxText.top = 30;
ui.addControl(approxText);

let clock = 0;

function updateScene() {
    const deltaTime = engine.getDeltaTime() / 1000;
    clock += deltaTime;
}

scene.executeWhenReady(() => {
    engine.loadingScreen.hideLoadingUI();
    scene.registerBeforeRender(() => updateScene());
    engine.runRenderLoop(() => {
        scene.render();
        uiScene.render();
    });
});

window.addEventListener("resize", () => {
    engine.resize();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
