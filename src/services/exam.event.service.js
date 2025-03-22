import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";

import ExamEventValidation from "../validations/exam.event.validation.js";

import {
  CreateExamEventRequest,
  GetExamEventsRequest,
  GetExamEventsResponse,
  GetExamEventRequest,
  ExamEventModel,
  UpdateExamEventRequest,
} from "../models/postgres/exam.event.model.js";

import { ExamineeModel } from "../models/postgres/examinee.model.js";
import { ExamineeResultsModel } from "../models/postgres/examinee.result.model.js";

const ExamEventService = {
  Create: async (request) => {
    request = CreateExamEventRequest(request);
    const createExamEventRequest = await Validation.validation(
      ExamEventValidation.CREATE_EXAM_EVENT,
      request
    );

    const existingExamEvent = await ExamEventModel.findUnique({
      where: {
        exam_event_name: createExamEventRequest.exam_event_name,
      },
    });

    if (existingExamEvent) ThrowError(400, "Exam Event Already Exists");

    const examEvent = await ExamEventModel.create({
      data: {
        ...createExamEventRequest,
      },
    });

    // Get Related Examinees
    const examinees = await ExamineeModel.findMany({
      where: {
        examinee_category: {
          in: examEvent.examinee_categories,
        },
      },
    });

    // Prepare Examinee Results
    const examineeResults = examinees.map((examinee) => ({
      examinee_id: examinee.examinee_id,
      examinee_name: examinee.examinee_name,
      exam_event_name: examEvent.exam_event_name,
    }));

    // Create Examinee Results
    const prepareExamineeResults = await ExamineeResultsModel.createMany({ data: examineeResults });

    if (prepareExamineeResults.count === 0) ThrowError(400, "Failed to prepare examinee results")

    return examEvent;
  },

  FindAll: async (request) => {
    request = GetExamEventsRequest(request);
    const totalExamEvents = await ExamEventModel.findMany();
    const totalPage = Math.ceil(totalExamEvents.length / request.limit);

    const where = {};

    if (request.search) {
      where.exam_event_name = { contains: request.search };
    }

    const examEvents = await ExamEventModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      where: {
        ...where,
        isDeleted: false,
      },
      orderBy: {
        exam_event_name: request.order,
      },
    });

    examEvents.totalPage = totalPage;
    examEvents.totalDatas = examEvents.length;

    const result = await GetExamEventsResponse(examEvents);
    return result;
  },

  FindOne: async (request) => {
    request = GetExamEventRequest(request);
    const getExamEventRequest = await Validation.validation(
      ExamEventValidation.GET_EXAM_EVENT,
      request
    );

    const result = await ExamEventModel.findUnique({
      where: {
        exam_event_name: getExamEventRequest.exam_event_name,
      },
    });

    if (!result) ThrowError(404, "Exam Event Not Found");

    return result;
  },

  Update: async (request) => {
    request = UpdateExamEventRequest(request);
    const updateExamEventRequest = await Validation.validation(
      ExamEventValidation.UPDATE_EXAM_EVENT,
      request
    );

    const isExamEventExists = await ExamEventModel.findUnique({
      where: {
        exam_event_name: updateExamEventRequest.param.exam_event_name,
      },
    });

    if (!isExamEventExists) ThrowError(400, "Exam Event Not Found");

    const updatedExamEvent = await ExamEventModel.update({
      where: {
        exam_event_name: updateExamEventRequest.param.exam_event_name,
      },
      data: {
        ...updateExamEventRequest.datas,
      },
    });

    return updatedExamEvent;
  },

  Delete: async (request) => {
    request = GetExamEventRequest(request);
    const deteleExamEventRequest = await Validation.validation(
      ExamEventValidation.GET_EXAM_EVENT,
      request
    );

    const existingExamEvent = await ExamEventModel.findUnique({
      where: {
        exam_event_name: deteleExamEventRequest.exam_event_name,
        isDeleted: false,
      },
    });

    if (!existingExamEvent) ThrowError(400, "Exam Package Not Found");

    const result = await ExamEventModel.update({
      where: {
        exam_event_name: deteleExamEventRequest.exam_event_name,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    if (!result) ThrowError(400, "Delete Exam Package Failed");
  },
};

export default ExamEventService;
