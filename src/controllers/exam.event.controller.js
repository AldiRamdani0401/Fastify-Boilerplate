import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamEventService from "../services/exam.event.service.js";

const ExamEventController = {
  createExamEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      request = request.body;
      const examEvent = await ExamEventService.Create(request);
      ResponseHandler(response, {
        code: 201,
        message: "New Exam Event Created Successfully",
        datas: examEvent,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getAllExamEvents: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examEvents = await ExamEventService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: examEvents,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDetailExamEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examEvent = await ExamEventService.FindOne(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: examEvent,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  updateExamEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const param = request.params.event;
      request = await FormHandler(request);
      const examEvent = await ExamEventService.Update({
        param,
        request,
      });
      ResponseHandler(response, {
        code: 200,
        message: "Exam Event Updated Successfully",
        datas: examEvent,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  deleteExamEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      await ExamEventService.Delete(request.params);
      ResponseHandler(response, {
        code: 200,
        message: "Exam Event Deleted Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamEventController;
