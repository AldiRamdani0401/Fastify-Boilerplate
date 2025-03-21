import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";

import { ExamCategoryModel } from "../models/postgres/exam.category.model.js";

import {
  CreateExamSubCategoryRequest,
  GetExamSubCategoriesRequest,
  GetExamSubCategoriesResponse,
  GetExamSubCategoryRequest,
  ExamSubCategoryModel,
  UpdateExamSubCategoryRequest,
} from "../models/postgres/exam.sub.category.model.js";
import ExamSubCategoryValidation from "../validations/exam.sub.category.validation.js";

const ExamSubCategoryService = {
  Create: async (request) => {
    request = CreateExamSubCategoryRequest(request);

    const createExamSubCategoryRequest = await Validation.validation(
      ExamSubCategoryValidation.CREATE_EXAM_SUB_CATEGORY,
      request
    );

    const isDuplicated = await ExamSubCategoryModel.findUnique({
      where: {
        sub_category_name: createExamSubCategoryRequest.sub_category_name,
      },
    });

    if (isDuplicated) ThrowError(400, "Exam Sub Category Already Exists");

    const importData = await ExamCategoryModel.findUnique({
      where: {
        category_name: request.category_name,
      },
      select: {
        admins: true,
        owner: true,
      },
    });

    createExamSubCategoryRequest.admins = [
      ...request.admins,
      ...(request.import_admins ? importData.admins : []),
    ];

    createExamSubCategoryRequest.owner = importData.owner;

    const result = await ExamSubCategoryModel.create({
      data: {
        ...createExamSubCategoryRequest,
      },
    });

    return result;
  },

  FindAll: async (request) => {
    request = GetExamSubCategoriesRequest(request);
    const where = {};
    if (request.search) {
      where.sub_category_name = { contains: request.search };
    }

    const subCategories = await ExamSubCategoryModel.findMany({
      where: {
        category_name: request.category_name,
        isDeleted: false,
        ...where,
      },
    });

    const totalPage = Math.ceil(subCategories.length / request.limit);

    const result = {
      list: GetExamSubCategoriesResponse(subCategories),
      total_page: totalPage,
      total_datas: subCategories.length,
    };

    return result;
  },

  FindOne: async (request) => {
    request = GetExamSubCategoryRequest(request);
    const result = await ExamSubCategoryModel.findUnique({
      where: {
        category_name: request.category_name,
        sub_category_name: request.sub_category_name,
      },
    });

    if (!result) ThrowError(404, "Exam Sub Category Not Found");
    return result;
  },

  Update: async (request) => {
    request = UpdateExamSubCategoryRequest(request);
    const updateExamSubCategoryRequest = await Validation.validation(
      ExamSubCategoryValidation.UPDATE_EXAM_SUB_CATEGORY,
      request
    );

    const result = await ExamSubCategoryModel.update({
      where: {
        category_name: request.category_name,
        sub_category_name: request.sub_category_name,
      },
      data: {
        ...updateExamSubCategoryRequest.updated_data,
      },
    });

    return result;
  },

  Delete: async (request) => {
    request = GetExamSubCategoryRequest(request);

    const result = await ExamSubCategoryModel.update({
      where: {
        category_name: request.category_name,
        sub_category_name: request.sub_category_name,
      },
      data: {
        isDeleted: true,
      },
    });

    return result;
  },
};

export default ExamSubCategoryService;
