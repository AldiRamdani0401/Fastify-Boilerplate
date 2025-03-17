import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import loadFaceApiModels from "./face-api-init.js";

// Patching Canvas for face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

export const generateDescriptorFromImage = async (buffer) => {
  try {
    // Check and load models only once
    if (!modelsLoaded) {
      console.log("Loading face-api models...");
      await loadFaceApiModels();
      modelsLoaded = true;
      console.log("Models loaded successfully!");
    }

    // Load image from buffer
    const image = await canvas.loadImage(buffer);

    // Perform face detection with landmarks and descriptors
    const detection = await faceapi
      .detectSingleFace(image, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptor();

    // Check if face or descriptor is not found
    if (!detection || !detection.descriptor) {
      throw new Error("No face detected in the image or descriptor not found");
    }

    // Return the descriptor as a regular array
    return Array.from(detection.descriptor);
  } catch (error) {
    // Handle errors (image loading, face detection, etc.)
    console.error(`Error during descriptor generation: ${error.message}`);
    throw new Error(`Error during descriptor generation: ${error.message}`);
  }
};
