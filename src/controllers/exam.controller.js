import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamService from "../services/exam.service.js";

const ExamController = {
  createExams: async (request, response) => {
    const requestTime = new Date().toISOString();
    try {
      let exams = await FormHandler(request);
      exams = await ExamService.Create(exams);
      await ResponseHandler(response, {
        code: 200,
        datas: exams,
        message: "Create Exams Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamController;
