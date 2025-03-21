import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamCategoryService from "../services/exam.category.service.js";

const ExamCategoryController = {
  createExamCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      let course = await FormHandler(request);
      course = await ExamCategoryService.Create(course);
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

  getAllExamCategories: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const categories = await ExamCategoryService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: categories,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDetailExamCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const category = await ExamCategoryService.FindOne(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: category,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  updateExamCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const param = request.params.category;
      let category = await FormHandler(request);
      category = await ExamCategoryService.Update(param, category);
      ResponseHandler(response, {
        code: 200,
        message: "Exam Category Updated Successfully",
        datas: category,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  deleteExamCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const param = request.params.category;
      await ExamCategoryService.Delete(param);
      ResponseHandler(response, {
        code: 200,
        message: "Exam Category Deleted Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDeletedExamCategories: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const deletedCategories = await ExamCategoryService.GetDelete(request);
      ResponseHandler(response, {
        code: 200,
        datas: deletedCategories,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  
  restoreDeletedExamCategories: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      let category = await FormHandler(request);
      category = await ExamCategoryService.RestoreDelete(category);
      ResponseHandler(response, {
        code: 200,
        message: "Exam Category Updated Successfully",
        datas: category,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamCategoryController;
