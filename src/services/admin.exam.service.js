import ThrowError from "../errors/throw.error.js";
import IdHandler from "../handlers/id.handler.js";
import Validation from "../validations/validation.js";

import ExamineesValidation from "../validations/examinee.validation.js";

import AdminExamValidation from "../validations/admin.exam.validation.js";

import {
  CreateExamineesRequest,
  GetExamineesRequest,
  GetExamineesResponse,
  GetExamineeRequest,
  UpdateExamineeRequest,
  ExamineeModel,
} from "../models/postgres/examinee.model.js";

import {
  AdminFindExamEventsRequest,
  ExamEventModel,
  GetExamEventsResponse,
} from "../models/postgres/exam.event.model.js";

const AdminExamService = {
  Create: async (request) => {
    request = await CreateExamineesRequest(request);
    let createExamineesRequest = await Validation.validation(
      ExamineesValidation.CREATE_EXAMINEES,
      request
    );

    const existingExaminees = await ExamineeModel.findMany({
      where: {
        OR: createExamineesRequest.map((examinee) => ({
          examinee_name: examinee.examinee_name,
          examinee_category: examinee.examinee_category,
        })),
      },
    });

    if (existingExaminees.length > 0) {
      const duplicateNames = existingExaminees.map(
        (examinee) => examinee.examinee_name
      );
      ThrowError(400, `Duplicate Examinee: ${duplicateNames.join(", ")}`);
    }

    createExamineesRequest = await Promise.all(
      createExamineesRequest.map(async (examinee) => {
        return {
          ...examinee,
          examinee_id: await IdHandler.generate("examinee"),
        };
      })
    );

    await ExamineeModel.createMany({
      data: createExamineesRequest,
    });

    const createdExaminees = await ExamineeModel.findMany({
      where: {
        examinee_id: {
          in: createExamineesRequest.map((examinee) => examinee.examinee_id),
        },
      },
    });

    return createdExaminees;
  },

  FindAll: async (request) => {
    request = GetExamineesRequest(request);
    const totalExaminees = await ExamineeModel.findMany();
    const totalPage = Math.ceil(totalExaminees.length / request.limit);

    const where = {};

    if (request.search) {
      where.OR = [
        { examinee_category: { contains: request.search } },
        { examinee_name: { contains: request.search } },
      ];
    }

    const examinees = await ExamineeModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      where: {
        ...where,
        isDeleted: false,
      },
      orderBy: {
        examinee_name: request.order,
      },
    });

    examinees.totalPage = totalPage;
    examinees.totalDatas = examinees.length;

    const result = await GetExamineesResponse(examinees);
    return result;
  },

  FindOne: async (request) => {
    request = GetExamineeRequest(request);
    const getExamineeRequest = await Validation.validation(
      ExamineesValidation.GET_EXAMINEE,
      request
    );

    const isValidId = await IdHandler.verify(getExamineeRequest.examinee_id);

    if (!isValidId) ThrowError(400, "Invalid Examinee ID");

    const result = await ExamineeModel.findUnique({
      where: {
        examinee_id: getExamineeRequest.examinee_id,
      },
    });

    if (!result) ThrowError(404, "Examinee Not Found");

    return result;
  },

  Update: async (request) => {
    request = UpdateExamineeRequest(request);
    const updateExamineeRequest = await Validation.validation(
      ExamineesValidation.UPDATE_EXAMINEE,
      request
    );

    const isExamineeExists = await ExamineeModel.findUnique({
      where: {
        examinee_id: updateExamineeRequest.param.examinee_id,
      },
    });

    if (!isExamineeExists) ThrowError(400, "Examinee Not Found");

    const updateExaminee = await ExamineeModel.update({
      where: {
        examinee_id: updateExamineeRequest.param.examinee_id,
      },
      data: {
        ...updateExamineeRequest.datas,
      },
    });

    return updateExaminee;
  },

  Delete: async (request) => {
    request = GetExamineeRequest(request);
    const deleteExamineeRequest = await Validation.validation(
      ExamineesValidation.GET_EXAMINEE,
      request
    );

    const existingExaminee = await ExamineeModel.findUnique({
      where: {
        examinee_id: deleteExamineeRequest.examinee_id,
        isDeleted: false,
      },
    });

    if (!existingExaminee) ThrowError(400, "Examinee Not Found");

    const result = await ExamineeModel.update({
      where: {
        examinee_id: deleteExamineeRequest.examinee_id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    if (!result) ThrowError(400, "Delete Examinee Failed");
  },

  // ADMIN //
  Admin: {
    FindAll: async (request) => {
      request = AdminFindExamEventsRequest(request);

      const where = {
        admins: {
          has: request.admins,
        },
      };

      if (request.search) {
        where.OR = [
          { exam_event_name: { contains: request.search } },
          { exam_package_id: { contains: request.search } },
          { examinee_categories: { has: request.search } },
          { proctors: { has: request.search } },
        ];
      }

      const adminExamEvents = await ExamEventModel.findMany({
        skip: (request.page - 1) * request.limit,
        take: request.limit,
        where,
        orderBy: {
          exam_event_name: request.order,
        },
        select: {
          exam_event_name: true,
          exam_package_id: true,
          owner: true,
          createdAt: true,
          updatedAt: true,
          proctors: true,
          end_time: true,
          start_time: true,
          isDeleted: true,
          examinee_categories: true,
        },
      });

      adminExamEvents.totalPage = Math.ceil(
        adminExamEvents.length / request.limit
      );
      adminExamEvents.totalDatas = adminExamEvents.length;

      const result = GetExamEventsResponse(adminExamEvents);

      return result;
    },

    FindOne: async (request) => {},
  },
};

export default AdminExamService;
