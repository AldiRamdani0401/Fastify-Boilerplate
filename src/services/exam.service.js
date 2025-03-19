import ThrowError from "../errors/throw.error.js";
import ExamValidation from "../validations/exam.validation.js";
import Validation from "../validations/validation.js";

import {
  CreateExamsRequest,
  GetExamsRequest,
  GetExamsResponse,
  ExamModel,
} from "../models/postgres/exam.model.js";

import {
  CreateExamCategoryRequest,
  GetExamCategoriesRequest,
  GetExamCategoriesResponse,
  ExamCategoryModel,
  GetExamCategoryRequest,
  GetExamCategoryResponse,
} from "../models/postgres/exam.category.model.js";
import ExamCategoryValidation from "../validations/exam.category.validation.js";
import { ExamSubCategoryModel } from "../models/postgres/exam.sub.category.model.js";

const ExamService = {
  CreateCategory: async (category) => {
    category = CreateExamCategoryRequest(category);
    const createExamCategoryRequest = await Validation.validation(
      ExamCategoryValidation.CREATE_EXAM_CATEGORY,
      category
    );

    const isDuplicated = await ExamCategoryModel.findUnique({
      where: {
        category_name: createExamCategoryRequest.category_name,
      },
    });

    if (isDuplicated) ThrowError(400, "Exam Category Already Exits");

    category = await ExamCategoryModel.create({
      data: {
        ...createExamCategoryRequest,
      },
    });

    return category;
  },

  FindAllCategories: async (request) => {
    request = GetExamCategoriesRequest(request);
    const totalCategories = await ExamCategoryModel.findMany();
    const totalPage = Math.ceil(totalCategories.length / request.limit);

    const where = {};

    if (request.filter) {
      where.category_name = request.filter;
    }

    if (request.search) {
      where.category_name = { startsWith: request.search };
    }

    const exams = await ExamCategoryModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      ...(Object.keys(where).length > 0 && { where }),
      orderBy: {
        category_name: request.order,
      },
    });

    exams.totalPage = totalPage;
    exams.totalDatas = exams.length;
    const result = await GetExamCategoriesResponse(exams);
    return result;
  },

  FindCategory: async (request) => {
    request = GetExamCategoryRequest(request);

    const getExamCategoryRequest = await Validation.validation(
      ExamCategoryValidation.GET_EXAM_CATEGORY,
      request
    );

    request = await ExamCategoryModel.findUnique({
      where: {
        category_name: getExamCategoryRequest.category_name,
      },
    });

    if (!request) ThrowError(404, "Exam Category Not Found");

    const examSubCategories = await ExamSubCategoryModel.findMany({
      where: {
        category_name: request.category_name,
      },
    });

    request.exam_sub_categories = examSubCategories;

    const result = await GetExamCategoryResponse(request);

    return result;
  },

  CreateExams: async (exams) => {
    exams = CreateExamsRequest(exams);

    let createExamsRequest = [];
    for (const exam of exams) {
      await Validation.validation(ExamValidation.CREATE_EXAM, exam);
      createExamsRequest.push(exam);
    }

    const existingExams = await ExamModel.findMany({
      where: {
        field: {
          in: createExamsRequest.map((exam) => exam.field),
        },
      },
      select: {
        field: true,
      },
    });

    const duplicateFields = existingExams.map((exam) => exam.field);

    if (existingExams.length > 0) {
      ThrowError(400, `Duplicate exams found : ${duplicateFields}`);
    }

    exams = await ExamModel.createMany({
      data: [...createExamsRequest],
    });

    if (!exams.count) ThrowError(500);

    exams = createExamsRequest;

    return exams;
  },

  FindAllExams: async (request) => {
    request = GetExamsRequest(request);
    const totalExams = await ExamCategoryModel.findMany();
    const totalPage = Math.ceil(totalExams.length / request.limit);

    const where = {};

    if (request.filter) where.category_name = request.filter;
    if (request.search) {
      where.category_name = { startsWith: request.search };
    }

    const exams = await ExamCategoryModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      ...(Object.keys(where).length > 0 && { where }),
      orderBy: {
        category_name: request.order,
      },
    });

    exams.totalPage = totalPage;
    exams.totalDatas = exams.length;
    const result = await GetExamsResponse(exams);
    return result;
  },
};

export default ExamService;
