import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ExamSubCategoryService from "../services/exam.sub.category.service.js";

const ExamSubCategoryController = {
  createExamSubCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const category = request.params.category;
      request = await FormHandler(request);
      const subCategory = await ExamSubCategoryService.Create({
        category,
        ...request,
      });
      ResponseHandler(response, {
        code: 201,
        message: "New Sub Category Created Successfully",
        datas: subCategory,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getAllExamSubCategories: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const subCategories = await ExamSubCategoryService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: subCategories,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getDetailExamSubCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const subCategory = await ExamSubCategoryService.FindOne(request);
      ResponseHandler(response, {
        code: 200,
        datas: subCategory,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  updateExamSubCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const updatedData = await FormHandler(request);
      updatedData.category_name = request.params.category;
      updatedData.sub_category_name = request.params.subcategory;

      const subCategory = await ExamSubCategoryService.Update(updatedData);
      ResponseHandler(response, {
        code: 200,
        message: "Update Sub Category Successfully",
        datas: subCategory,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  deleteExamSubCategory: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();

      await ExamSubCategoryService.Delete(request);
      ResponseHandler(response, {
        code: 200,
        message: "Delete Sub Category Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamSubCategoryController;
