import Validation from "../validations/validation.js";
import ExamCategoryValidation from "../validations/exam.category.validation.js";
import ThrowError from "../errors/throw.error.js";

import {
  CreateExamCategoryRequest,
  GetExamCategoriesRequest,
  GetExamCategoriesResponse,
  GetExamCategoryRequest,
  GetExamCategoryResponse,
  ExamCategoryModel,
  UpdateExamCategoryRequest,
} from "../models/postgres/exam.category.model.js";

import { ExamSubCategoryModel } from "../models/postgres/exam.sub.category.model.js";

const ExamCategoryService = {
  Create: async (category) => {
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

    if (isDuplicated) ThrowError(400, "Exam Category Already Exists");

    category = await ExamCategoryModel.create({
      data: {
        ...createExamCategoryRequest,
      },
    });

    return category;
  },

  FindAll: async (request) => {
    request = GetExamCategoriesRequest(request);
    const totalCategories = await ExamCategoryModel.findMany();
    const totalPage = Math.ceil(totalCategories.length / request.limit);

    const where = {};

    if (request.filter) {
      where.category_name = request.filter;
    }

    if (request.search) {
      where.category_name = { contains: request.search };
    }

    const exams = await ExamCategoryModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      where: {
        isDeleted: false,
        ...where,
      },
      orderBy: {
        category_name: request.order,
      },
    });

    exams.totalPage = totalPage;
    exams.totalDatas = exams.length;
    const result = await GetExamCategoriesResponse(exams);
    return result;
  },

  FindOne: async (request) => {
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

  Update: async (param, request) => {
    request = UpdateExamCategoryRequest(request);
    const updateExamCategoryRequest = await Validation.validation(
      ExamCategoryValidation.UPDATE_EXAM_CATEGORY,
      request
    );

    const isExamCategoryExists = await ExamCategoryModel.findUnique({
      where: { category_name: param },
    });

    if (!isExamCategoryExists) ThrowError(404, "Exam Category Name Not Found");

    const updatedExamCategory = await ExamCategoryModel.update({
      where: {
        category_name: param,
      },
      data: {
        ...updateExamCategoryRequest,
      },
    });

    return updatedExamCategory;
  },

  Delete: async (request) => {
    request = GetExamCategoryRequest({ category: request });
    request = await Validation.validation(
      ExamCategoryValidation.GET_EXAM_CATEGORY,
      request
    );

    const result = await ExamCategoryModel.update({
      where: {
        category_name: request.category_name,
      },
      data: {
        isDeleted: true,
      },
    });

    return result;
  },

  GetDelete: async (request) => {
    request = GetExamCategoriesRequest(request);
    const totalCategories = await ExamCategoryModel.findMany();
    const totalPage = Math.ceil(totalCategories.length / request.limit);

    const where = {};

    if (request.filter) {
      where.category_name = request.filter;
    }

    if (request.search) {
      where.category_name = { contains: request.search };
    }

    const exams = await ExamCategoryModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      where: {
        isDeleted: true,
        ...where,
      },
      orderBy: {
        category_name: request.order,
      },
    });

    exams.totalPage = totalPage;
    exams.totalDatas = exams.length;
    const result = await GetExamCategoriesResponse(exams);
    return result;
  },

  RestoreDelete: async (request) => {
    request = UpdateExamCategoryRequest(request);
    const updateExamCategoryRequest = await Validation.validation(
      ExamCategoryValidation.UPDATE_EXAM_CATEGORY,
      request
    );

    const isExamCategoryExists = await ExamCategoryModel.findUnique({
      where: { category_name: param },
    });

    if (!isExamCategoryExists) ThrowError(404, "Exam Category Name Not Found");

    const updatedExamCategory = await ExamCategoryModel.update({
      where: {
        category_name: param,
      },
      data: {
        ...updateExamCategoryRequest,
      },
    });

    return updatedExamCategory;
  },
};

export default ExamCategoryService;
