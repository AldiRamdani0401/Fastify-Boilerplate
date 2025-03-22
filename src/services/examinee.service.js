import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";

import ExamineesValidation from "../validations/examinee.validation.js";

import {
  ExamineeModel,
  GetExamineeEventRequest,
  GetExamineeEventsRequest,
  GetExamineeEventsResponse,
  StartExamRequest,
} from "../models/postgres/examinee.model.js";
import { ExamineeResultsModel } from "../models/postgres/examinee.result.model.js";
import IdHandler from "../handlers/id.handler.js";
import { ExamEventModel } from "../models/postgres/exam.event.model.js";
import { ExamPackageModel } from "../models/postgres/exam.package.model.js";

const ExamineeService = {
  FindAll: async (request) => {
    const getExamineeRequest = GetExamineeEventsRequest(request);

    getExamineeRequest.examinee_id = request.params.examineeId;

    const examinee = await ExamineeModel.findUnique({
      where: { examinee_id: getExamineeRequest.examinee_id },
      select: { examinee_id: true },
    });

    if (!examinee) {
      ThrowError(400, "Examinee Not Found");
    }

    let searchFilter = {};
    if (
      getExamineeRequest.search === "1" ||
      getExamineeRequest.search === "2"
    ) {
      getExamineeRequest.search =
        getExamineeRequest.search === "1" ? true : false;
      searchFilter = { examinee_exam_status: getExamineeRequest.search };
    } else if (
      typeof getExamineeRequest.search === "string" &&
      getExamineeRequest.search.trim() !== ""
    ) {
      searchFilter = {
        exam_event_name: { contains: getExamineeRequest.search },
      };
    }

    const examineeResults = await ExamineeResultsModel.findMany({
      where: {
        examinee_id: examinee.examinee_id,
        ...searchFilter,
      },
      select: {
        exam_event_name: true,
        examinee_exam_status: true,
        ExamEvent: {
          select: {
            exam_package_id: true,
            start_time: true,
            end_time: true,
          },
        },
      },
    });

    const examineeEvents = examineeResults.map((result) => ({
      exam_event_name: result.exam_event_name,
      exam_package_id: result.ExamEvent.exam_package_id,
      start_time: result.ExamEvent.start_time,
      end_time: result.ExamEvent.end_time,
      examinee_exam_status: result.examinee_exam_status,
    }));

    examineeEvents.totalDatas = examineeResults.length;
    examineeEvents.totalPage = Math.ceil(
      examineeResults.length / (request.limit || 10)
    );

    const result = await GetExamineeEventsResponse(examineeEvents);

    return result;
  },

  FindOne: async (request) => {
    request = GetExamineeEventRequest(request);
    const getExamineeEventRequest = await Validation.validation(
      ExamineesValidation.GET_EXAMINEE_EVENT,
      request
    );

    const isValidId = await IdHandler.verify(
      getExamineeEventRequest.examinee_id
    );

    if (!isValidId) ThrowError(400, "Invalid Examinee ID");

    const examineeResult = await ExamineeResultsModel.findFirst({
      where: {
        examinee_id: getExamineeEventRequest.examinee_id,
        exam_event_name: getExamineeEventRequest.exam_event_name,
      },
      select: {
        exam_result_id: true,
        examinee_id: true,
        examinee_name: true,
        examinee_exam_results: true,
        examinee_exam_fouls: true,
        examinee_exam_status: true,
        start_at: true,
        finished_at: true,
      },
    });

    const examineeEvent = await ExamEventModel.findUnique({
      where: {
        exam_event_name: getExamineeEventRequest.exam_event_name,
      },
      select: {
        exam_package_id: true,
      },
    });

    const examPackage = await ExamPackageModel.findUnique({
      where: {
        exam_package_name: examineeEvent.exam_package_id,
      },
    });

    if (!examineeResult || !examineeEvent) {
      ThrowError(400, "Process stopped or failed");
    }

    const examineeEventResult = {
      ...examineeResult,
      // ...examineeEvent,
    };

    return examineeEventResult;
  },

  StartExam: async (request) => {
    request = StartExamRequest(request);
    const startExamRequest = await Validation.validation(
      ExamineesValidation.START_EXAM,
      request
    );

    // Check Examinee ID Valid
    const isValidId = await IdHandler.verify(
      startExamRequest.params.examinee_id
    );

    if (!isValidId) ThrowError(400, "Process stopped or failed");

    // Check Examinee Existing
    const existingExaminee = await ExamineeModel.findUnique({
      where: {
        examinee_id: startExamRequest.params.examinee_id,
      },
    });

    if (!existingExaminee) ThrowError(400, "Process stopped or failed");

    // Update Examinee Result (ongoing & start_at)

    const existingExamineeResult = await ExamineeResultsModel.findFirst({
      where: {
        examinee_id: startExamRequest.params.examinee_id,
        exam_event_name: startExamRequest.params.exam_event_name,
      },
      select: {
        exam_result_id: true,
      },
    });

    if (!existingExamineeResult) ThrowError(400, "Process stopped or failed");

    const updateExamineeResult = await ExamineeResultsModel.update({
      where: {
        exam_result_id: existingExamineeResult.exam_result_id,
        examinee_id: startExamRequest.params.examinee_id,
        exam_event_name: startExamRequest.params.exam_event_name,
      },
      data: {
        start_at: startExamRequest.datas.start_at,
        examinee_exam_status: "ongoing",
      },
    });

    if (!updateExamineeResult) ThrowError(400, "Process stopped or failed");

    // Load Exam Package
    const examPackage = await ExamPackageModel.findUnique({
      where: {
        exam_package_name: startExamRequest.params.exam_package_id,
      },
    });
    console.debug(startExamRequest);
    console.debug(examPackage);

    // Register Exam Sheet
  },
};

export default ExamineeService;
