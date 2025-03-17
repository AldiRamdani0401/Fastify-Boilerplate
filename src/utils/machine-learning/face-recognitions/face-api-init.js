import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import path from "path";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const modelPath = path.join(
  process.cwd(),
  "src/utils/machine-learning/face-recognitions/models"
);

async function loadFaceApiModels() {
  try {
    console.log(`Loading face-api models from ${modelPath}`);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    console.log("✅ Face API models loaded successfully");
  } catch (err) {
    console.error("Error loading models:", err);
  }
}

export default loadFaceApiModels;
