import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import { CreateFaceRequest } from "../models/postgres/face.recognition.model.js";
import FaceRecognitionService from "../services/face.recognition.service.js";
import { generateDescriptorFromImage } from "../utils/machine-learning/face-recognitions/generator-descriptor.js";

const FaceRecoginitionController = {
  createFaceRecognition: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      let face = await FormHandler(request);

      if (!face?.files?.[0]?.buffer) {
        throw new Error("File wajah tidak ditemukan!");
      }

      const descriptor = await generateDescriptorFromImage(
        face.files[0].buffer
      );
      face.descriptor = descriptor;

      const formattedRequest = CreateFaceRequest(face);
      const savedFace = await FaceRecognitionService.Create(formattedRequest);

      ResponseHandler(response, {
        code: 200,
        datas: savedFace,
        timeRequest: requestTime,
      });
    } catch (error) {
      console.error(error);
      ResponseHandler(response, {
        code: 400,
        error: error.message,
      });
    }
  },
  recognizeFace: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const face = await FormHandler(request);

      if (!face?.files?.[0]?.buffer) {
        throw new Error("File wajah tidak ditemukan!");
      }

      const result = await FaceRecognitionService.Match(face.files[0].buffer);

      ResponseHandler(response, {
        code: 200,
        datas: result,
        timeRequest: requestTime,
      });
    } catch (error) {
      console.error(error);
      ResponseHandler(response, {
        code: 400,
        error: error.message,
      });
    }
  },
};

export default FaceRecoginitionController;
