import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";
import AdminExamService from "../services/admin.exam.service.js";

const AdminExamController = {
  Examinee: {
    Create: async (request, response) => {
      try {
        const requestTime = new Date().toISOString();
        request = await FormHandler(request);

        const examinees = await AdminExamService.Create(request);
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

    GetAll: async (request, response) => {
      try {
        const requestTime = new Date().toISOString();
        const examinees = await AdminExamService.FindAll(request);
        ResponseHandler(response, {
          code: 200,
          datas: examinees,
          timeRequest: requestTime,
        });
      } catch (error) {
        throw error;
      }
    },

    GetDetail: async (request, response) => {
      try {
        const requestTime = new Date().toISOString();
        const examinee = await AdminExamService.FindOne(request.params);
        ResponseHandler(response, {
          code: 200,
          datas: examinee,
          timeRequest: requestTime,
        });
      } catch (error) {
        throw error;
      }
    },

    Update: async (request, response) => {
      try {
        const requestTime = new Date().toISOString();
        const param = request.params.examineeId;
        request = await FormHandler(request);
        const examinee = await AdminExamService.Update({
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

    Delete: async (request, response) => {
      try {
        const requestTime = new Date().toISOString();
        const examinee = await AdminExamService.Delete(request.params);
        ResponseHandler(response, {
          code: 200,
          datas: examinee,
          timeRequest: requestTime,
        });
      } catch (error) {
        throw error;
      }
    },
  },





  // Examinee Events (Admin) //
  getExamEventsRelatedAdmin: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const adminExamEvents = await AdminExamService.Admin.FindAll(
        request
      );
      ResponseHandler(response, {
        code: 200,
        datas: adminExamEvents,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },

  getDetailExamEventRelatedAdmin: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const adminExamEvent = await AdminExamService.Admin.FindOne(request);
      ResponseHandler(response, {
        code: 200,
        datas: adminExamEvent,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default AdminExamController;
