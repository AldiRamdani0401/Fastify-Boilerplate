import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamEventService from "../services/exam.event.service.js";

const ExamEventController = {
  createExamEvent: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      request = await FormHandler(request);
      const examEvent = await ExamEventService.CreateExamEvent(request);
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
};

export default ExamEventController;
