import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";
import IdHandler from "../handlers/id.handler.js";

import ExamineesValidation from "../validations/examinee.validation.js";

import {
  ExamineeModel,
  GetExamineeEventRequest,
  GetExamineeEventsRequest,
  GetExamineeEventsResponse,
  StartExamRequest,
  SubmitExamRequest,
} from "../models/postgres/examinee.model.js";

import { ExamineeResultsModel } from "../models/postgres/examinee.result.model.js";

import { ExamEventModel } from "../models/postgres/exam.event.model.js";

import { ExamPackageModel } from "../models/postgres/exam.package.model.js";

import {
  ExamineeExamQuestionsResponse,
  ExamQuestionModel,
} from "../models/postgres/exam.question.model.js";
import { ExamSheetsModel } from "../models/postgres/exam.sheet.model.js";

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
        exam_category: true,
        examinee_exam_results: true,
        examinee_exam_fouls: true,
        examinee_exam_status: true,
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

    // Update Examinee Result (ongoing)

    const existingExamineeResult = await ExamineeResultsModel.findFirst({
      where: {
        examinee_id: startExamRequest.params.examinee_id,
        exam_event_name: startExamRequest.params.exam_event_name,
        exam_category: startExamRequest.params.exam_category,
      },
      select: {
        exam_result_id: true,
        examinee_sheet_id: true,
        examinee_id: true,
        exam_event_name: true,
        exam_category: true,
        exam_sub_category: true,
      },
    });

    if (!existingExamineeResult) ThrowError(400, "Process stopped or failed");

    const updateExamineeResult = await ExamineeResultsModel.update({
      where: {
        exam_result_id: existingExamineeResult.exam_result_id,
        examinee_id: startExamRequest.params.examinee_id,
        exam_event_name: startExamRequest.params.exam_event_name,
        exam_category: startExamRequest.params.exam_category,
      },
      data: {
        examinee_exam_status: "ongoing",
      },
    });

    if (!updateExamineeResult) ThrowError(400, "Process stopped or failed");

    // Load Exam Questions
    const examQuetions = await ExamQuestionModel.findMany({
      where: {
        exam_category: updateExamineeResult.exam_category,
        exam_sub_category: updateExamineeResult.exam_sub_category,
      },
      select: {
        id: true,
        exam_type: true,
        answers: true,
        exam_sub_category: true,
        exam_category: true,
        question: true,
      },
    });

    // Set Start Time (Examinee Sheet)
    const setStartExamSheet = await ExamSheetsModel.update({
      where: {
        examinee_sheet_id: existingExamineeResult.examinee_sheet_id,
        examinee_id: existingExamineeResult.examinee_id,
        exam_event_name: existingExamineeResult.exam_event_name,
        exam_category: existingExamineeResult.exam_category,
        exam_sub_category: existingExamineeResult.exam_sub_category,
      },
      data: {
        start_at: new Date().toISOString(),
        examinee_exam_status: "ongoing",
      },
      select: {
        examinee_sheet_id: true,
        exam_event_name: true,
        examinee_id: true,
        examinee_name: true,
        examinee_exam_sheet: true,
        exam_category: true,
        exam_sub_category: true,
        examinee_exam_status: true,
        finished_at: true,
        start_at: true,
      },
    });

    if (!setStartExamSheet) ThrowError(400, "Process stopped or failed");

    const results = await ExamineeExamQuestionsResponse(
      setStartExamSheet,
      examQuetions
    );

    return results;
  },

  SubmitExam: async (request) => {
    request = SubmitExamRequest(request);
    const submitExamRequest = await Validation.validation(
      ExamineesValidation.SUBMIT_EXAM,
      request
    );

    // Check Examinee ID Valid
    const isValidId = await IdHandler.verify(request.params.examinee_id);

    if (!isValidId) ThrowError(400, "Process stopped or failed");

    //  Store Exam Sheets
    const existingExamineeExamSheet = await ExamSheetsModel.findFirst({
      where: {
        examinee_sheet_id: submitExamRequest.datas.examinee_sheet_id,
        examinee_id: submitExamRequest.datas.examinee_id,
        examinee_name: submitExamRequest.datas.examinee_name,
        exam_event_name: submitExamRequest.datas.exam_event_name,
        exam_category: submitExamRequest.datas.exam_category,
        exam_sub_category: submitExamRequest.datas.exam_sub_category,
        start_at: submitExamRequest.datas.start_at,
        examinee_exam_status: "ongoing",
      },
      select: {
        examinee_sheet_id: true,
        examinee_id: true,
        examinee_name: true,
        exam_event_name: true,
        exam_category: true,
        exam_sub_category: true,
        start_at: true,
      },
    });

    if (!existingExamineeExamSheet) {
      ThrowError(400, "Process stopped or failed");
    }

    const examineeExamSheet = await ExamSheetsModel.update({
      where: {
        ...existingExamineeExamSheet,
      },
      data: {
        examinee_exam_sheet: submitExamRequest.datas.examinee_exam_sheet,
        examinee_exam_status: true,
        finished_at: submitExamRequest.datas.finished_at,
      },
    });

    if (!examineeExamSheet) ThrowError(400, "Process stopped or failed");

    // Store Exam Results
    const examineeResult = await ExamineeResultsModel.findFirst({
      where: {
        examinee_sheet_id: examineeExamSheet.examinee_sheet_id,
      },
    });

    const updateExamineeResult = await ExamineeResultsModel.update({
      where: {
        exam_result_id: examineeResult.exam_result_id,
      },
      data: {
        examinee_exam_status: examineeExamSheet.examinee_exam_status,
      },
    });

    if (!updateExamineeResult) ThrowError(400, "Process stopped or failed");
  },
};

export default ExamineeService;
