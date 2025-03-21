import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamQuestionService from "../services/exam.question.service.js";

const ExamQuestionController = {
  createExamQuestions: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      let examQuestions = await FormHandler(request);
      examQuestions = await ExamQuestionService.Create(
        request.params,
        examQuestions
      );
      ResponseHandler(response, {
        code: 200,
        datas: examQuestions,
        message: "Create Exam Questions Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getAllExamQuestions: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const exams = await ExamQuestionService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: exams,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getDetailExamQuestion: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examQuestion = await ExamQuestionService.FindOne(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: examQuestion,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  updateExamQuestion: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const params = request.params;
      let examQuestion = await FormHandler(request);
      examQuestion = await ExamQuestionService.Update(params, examQuestion);
      ResponseHandler(response, {
        code: 200,
        message: "Exam Question Updated Successfully",
        datas: examQuestion,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  deleteExamQuestion: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const params = request.params;
      await ExamQuestionService.Delete(params);
      ResponseHandler(response, {
        code: 200,
        message: "Exam Question Deleted Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getDeletedExamQuestions: async (request, response) => {},
};

export default ExamQuestionController;
