import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamineeService from "../services/examinee.service.js";

const ExamineeController = {
  getAllExamineeEvents: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examineeEvents = await ExamineeService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: examineeEvents,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDetailExamineeEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examineeEvent = await ExamineeService.FindOne(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: examineeEvent,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  startExamineeEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const params = request.params;
      // const formData = await FormHandler(request);
      const formData = request.body;
      const examPackage = await ExamineeService.StartExam({ params, formData });
      ResponseHandler(response, {
        code: 201,
        message: "Exam Event Started",
        datas: examPackage,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  submitExamineeEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const params = request.params;
      const formData = request.body;
      await ExamineeService.SubmitExam({
        params,
        formData,
      });
      ResponseHandler(response, {
        code: 200,
        message: "Exam Event Submitted",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamineeController;
