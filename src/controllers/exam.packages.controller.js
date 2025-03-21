import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";

import ExamPackageService from "../services/exam.package.service.js";

const ExamPackagesController = {
  createExamPackage: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      request = await FormHandler(request);
      const examPackage = await ExamPackageService.Create(request);
      ResponseHandler(response, {
        code: 201,
        message: "New Exam Package Created Successfully",
        datas: examPackage,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getAllExamPackages: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examPackages = await ExamPackageService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: examPackages,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDetailExamPackage: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examPackage = await ExamPackageService.FindOne(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: examPackage,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  updateExamPackage: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const param = request.params.packageId;
      const examPackage = await ExamPackageService.Update({param, request});
      ResponseHandler(response, {
        code: 200,
        message: "Exam Package Updated Successfully",
        datas: examPackage,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ExamPackagesController;
