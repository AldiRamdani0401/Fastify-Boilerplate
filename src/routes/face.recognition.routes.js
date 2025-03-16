import FaceRecoginitionController from "../controllers/face.recognition.controller.js";

async function FaceRecoginitionRoutes(fastify, options) {
  fastify.post(
    "/face-recognitions",
    FaceRecoginitionController.createFaceRecognition
  );
  fastify.post(
    "/face-recognitions/recognize",
    FaceRecoginitionController.recognizeFace
  );
}

export default FaceRecoginitionRoutes;
