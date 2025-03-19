import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamService from "../services/exam.service.js";

const ExamController = {
  createExamCategory: async (request, response) => {
    const requestTime = new Date().toISOString();
    try {
      let course = await FormHandler(request);
      course = await ExamService.CreateCategory(course);
      ResponseHandler(response, {
        code: 200,
        message: "Create Category Successfully",
        datas: course,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getAllCategories: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const categories = await ExamService.FindAllCategories(request);
      ResponseHandler(response, {
        code: 200,
        datas: categories,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getDetailCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const categories = await ExamService.FindCategory(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: categories,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  createExams: async (request, response) => {
    const requestTime = new Date().toISOString();
    try {
      let exams = await FormHandler(request);
      exams = await ExamService.CreateExams(exams);
      ResponseHandler(response, {
        code: 200,
        datas: exams,
        message: "Create Exams Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getAllExams: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const exams = await ExamService.FindAllExams(request);
      ResponseHandler(response, {
        code: 200,
        datas: exams,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamController;
