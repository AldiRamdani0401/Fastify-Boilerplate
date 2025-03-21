import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";
import ExamQuestionValidation from "../validations/exam.question.validation.js";

import {
  CreateExamQuestionRequest,
  GetExamQuestionsRequest,
  GetExamQuestionsResponse,
  ExamQuestionModel,
  GetExamQuestionRequest,
  UpdateExamQuestionRequest,
} from "../models/postgres/exam.question.model.js";

const ExamQuestionService = {
  Create: async (params, exams) => {
    const { category, subcategory } = params;

    exams = CreateExamQuestionRequest({ category, subcategory }, exams);

    let createExamQuestionsRequest = [];
    for (const exam of exams) {
      await Validation.validation(
        ExamQuestionValidation.CREATE_EXAM_QUESTION,
        exam
      );
      createExamQuestionsRequest.push(exam);
    }

    const existingExams = await ExamQuestionModel.findMany({
      where: {
        question: {
          in: createExamQuestionsRequest.map((exam) => exam.question),
        },
      },
      select: {
        question: true,
      },
    });

    const duplicateQuestions = existingExams.map((exam) => exam.question);

    if (existingExams.length > 0) {
      ThrowError(400, `Duplicate exams found : ${duplicateQuestions}`);
    }

    exams = await ExamQuestionModel.createMany({
      data: [...createExamQuestionsRequest],
    });

    if (!exams.count) ThrowError(500);

    exams = createExamQuestionsRequest;

    return exams;
  },

  FindAll: async (request) => {
    request = GetExamQuestionsRequest(request);
    const totalExams = await ExamQuestionModel.findMany();
    const totalPage = Math.ceil(totalExams.length / request.limit);

    const where = {};

    if (request.filter.exam_category) {
      where.exam_category = request.filter.exam_category;
    }
    if (request.filter.exam_sub_category) {
      where.exam_sub_category = request.filter.exam_sub_category;
    }
    if (request.search) {
      where.question = { contains: request.search };
    }

    const exams = await ExamQuestionModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      where: {
        ...where,
        isDeleted: false,
      },
      orderBy: {
        exam_category: request.order,
      },
    });

    exams.totalPage = totalPage;
    exams.totalDatas = exams.length;
    const result = await GetExamQuestionsResponse(exams);
    return result;
  },

  FindOne: async (request) => {
    request = GetExamQuestionRequest(request);
    const getExamQuestionRequest = await Validation.validation(
      ExamQuestionValidation.GET_EXAM_QUESTION,
      request
    );

    const result = await ExamQuestionModel.findUnique({
      where: {
        id: getExamQuestionRequest.id,
        exam_category: getExamQuestionRequest.exam_category,
        exam_sub_category: getExamQuestionRequest.exam_sub_category,
        isDeleted: false,
      },
    });

    if (!result) ThrowError(404, "Exam Question Not Found");

    return result;
  },

  Update: async (params, request) => {
    request = UpdateExamQuestionRequest({ params, request });
    const updateExamQuestionRequest = await Validation.validation(
      ExamQuestionValidation.UPDATE_EXAM_QUESTION,
      request
    );

    const existingExamQuestion = await ExamQuestionModel.findUnique({
      where: {
        id: updateExamQuestionRequest.params.id,
      },
    });

    if (!existingExamQuestion) ThrowError(400, "Exam Question Not Found");

    const updateExamQuestion = await ExamQuestionModel.update({
      where: {
        id: updateExamQuestionRequest.params.id,
      },
      data: {
        ...updateExamQuestionRequest.datas,
      },
    });

    return updateExamQuestion;
  },

  Delete: async (request) => {
    request = GetExamQuestionRequest(request);
    request = await Validation.validation(
      ExamQuestionValidation.GET_EXAM_QUESTION,
      request
    );

    const existingExamQuestion = await ExamQuestionModel.findUnique({
      where: {
        id: request.id,
        isDeleted: false,
      },
    });

    if (!existingExamQuestion) ThrowError(400, "Exam Question Not Found");

    const result = await ExamQuestionModel.update({
      where: {
        id: request.id,
      },
      data: {
        isDeleted: true,
      },
    });

    return result;
  },
};

export default ExamQuestionService;
