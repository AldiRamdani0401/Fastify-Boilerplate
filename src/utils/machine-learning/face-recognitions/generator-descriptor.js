import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export const generateDescriptorFromImage = async (imageBuffer) => {
  const img = await canvas.loadImage(imageBuffer);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("Wajah tidak terdeteksi!");
  return Array.from(detection.descriptor);
};
