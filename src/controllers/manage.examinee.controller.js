import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import ManageExamineeService from "../services/manage.examinee.service.js";

const ManageExamineeController = {
  createExaminees: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      request = await FormHandler(request);

      const examinees = await ManageExamineeService.Create(request);
      ResponseHandler(response, {
        code: 201,
        message: "New Examinees Created Successfully",
        datas: examinees,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getAllExaminees: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examinees = await ManageExamineeService.FindAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: examinees,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDetailExaminee: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examinee = await ManageExamineeService.FindOne(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: examinee,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  updateExaminee: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const param = request.params.examineeId;
      request = await FormHandler(request);
      const examinee = await ManageExamineeService.Update({
        param,
        request,
      });
      ResponseHandler(response, {
        code: 200,
        message: "Examinee Updated Successfully",
        datas: examinee,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  deleteExaminee: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const examinee = await ManageExamineeService.Delete(request.params);
      ResponseHandler(response, {
        code: 200,
        datas: examinee,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default ManageExamineeController;
