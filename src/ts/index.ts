import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Loading/loadingScreen";

import "../styles/index.scss";

import {Planet} from "./planet/createPlanet";
import {ArcRotateCamera, DirectionalLight} from "@babylonjs/core";
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";

const canvas = document.getElementById("renderer") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);
engine.displayLoadingUI();

const scene = new Scene(engine);

const camera = new ArcRotateCamera("camera", 3.14/2, 3.14/2, 15, Vector3.Zero(), scene);
camera.lowerAlphaLimit = 0 + 0.5;
camera.upperAlphaLimit = 3.14 - 0.5;
camera.attachControl();

const light = new DirectionalLight("light", new Vector3(0, 5, 10).negateInPlace().normalize(), scene);

const planetAnalytic = new Planet(4, true, scene);
planetAnalytic.node.position.x = 5;

const planetApprox = new Planet(4, false, scene);
planetApprox.node.position.x = -5;

const ui = AdvancedDynamicTexture.CreateFullscreenUI("ui");

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
    engine.runRenderLoop(() => scene.render());
});

window.addEventListener("resize", () => {
    engine.resize();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

