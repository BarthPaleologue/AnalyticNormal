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

import "@babylonjs/core/Misc/screenshotTools";
import { Tools } from "@babylonjs/core/Misc/tools";

const canvas = document.getElementById("renderer") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);
engine.displayLoadingUI();

const scene = new Scene(engine);

const light = new DirectionalLight("light", new Vector3(0, 5, 10).negateInPlace().normalize(), scene);

const PLANET_RADIUS = 10; //1000e3;

const planetAnalytic = new Planet(PLANET_RADIUS, true, scene);
planetAnalytic.node.position.x = 10;
planetAnalytic.node.getChildMeshes().forEach(mesh => {
    mesh.layerMask = 1;
});

const camera1 = new ArcRotateCamera("camera", 3.14 / 2, 3.14 / 2, PLANET_RADIUS * 4, planetAnalytic.node.position, scene);
camera1.lowerRadiusLimit = PLANET_RADIUS * 2;
camera1.upperRadiusLimit = PLANET_RADIUS * 6;
camera1.maxZ = PLANET_RADIUS * 8;
camera1.layerMask = 1;
camera1.attachControl(canvas, true);

const planetApprox = new Planet(PLANET_RADIUS, false, scene);
planetApprox.node.position.x = -10;
planetApprox.node.getChildMeshes().forEach(mesh => {
    mesh.layerMask = 2;
});

const camera2 = new ArcRotateCamera("camera2", 3.14 / 2, 3.14 / 2, PLANET_RADIUS * 4, planetApprox.node.position, scene);
camera2.lowerRadiusLimit = PLANET_RADIUS * 2;
camera2.upperRadiusLimit = PLANET_RADIUS * 6;
camera2.maxZ = PLANET_RADIUS * 8;
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

document.addEventListener("keypress", (e) => {
    if (e.key === "p") {
        // take screenshot
        Tools.CreateScreenshot(engine, camera1, { precision: 1 });
        Tools.CreateScreenshot(engine, camera2, { precision: 1 });
    }
});
