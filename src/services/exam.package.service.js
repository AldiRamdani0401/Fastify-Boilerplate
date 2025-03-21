import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";

import ExamPackageValidation from "../validations/exam.package.validation.js";

import {
  CreateExamPackageRequest,
  GetExamPackageRequest,
  GetExamPackagesRequest,
  GetExamPackagesResponse,
  UpdateExamPackageRequest,
  ExamPackageModel,
} from "../models/postgres/exam.package.model.js";

import { ExamQuestionModel } from "../models/postgres/exam.question.model.js";

const ExamPackageService = {
  Create: async (request) => {
    request = CreateExamPackageRequest(request);
    let createExamPackageRequest = await Validation.validation(
      ExamPackageValidation.CREATE_EXAM_PACKAGE,
      request
    );

    const existingExamPackage = await ExamPackageModel.findUnique({
      where: {
        exam_package_name: createExamPackageRequest.exam_package_name,
      },
    });

    if (existingExamPackage) ThrowError(400, "Exam Package Already Exists");

    const getExamQuestions = await Promise.all(
      createExamPackageRequest.exam_package_questions.map(async (question) => ({
        exam_category: question.exam_category,
        exam_sub_category: question.exam_sub_category,
        questions: await ExamQuestionModel.findMany({
          where: {
            exam_category: question.exam_category,
            exam_sub_category: question.exam_sub_category,
          },
        }).then((quests) =>
          quests.map((quest) => ({
            id: quest.id,
            exam_category: quest.exam_category,
            exam_sub_category: quest.exam_sub_category,
            exam_type: quest.exam_type,
            field: quest.field,
            answers: quest.answers,
          }))
        ),
      }))
    );

    createExamPackageRequest.exam_package_questions = getExamQuestions;

    const examPackage = await ExamPackageModel.create({
      data: {
        ...createExamPackageRequest,
      },
    });

    return examPackage;
  },

  FindAll: async (request) => {
    request = GetExamPackagesRequest(request);
    const totalExamPackages = await ExamPackageModel.findMany();
    const totalPage = Math.ceil(totalExamPackages.length / request.limit);

    const where = {};

    if (request.search) {
      where.exam_package_name = { contains: request.search };
    }

    const examPackages = await ExamPackageModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      ...(Object.keys(where).length > 0 && { where }),
      orderBy: {
        exam_package_name: request.order,
      },
    });

    examPackages.totalPage = totalPage;
    examPackages.totalDatas = examPackages.length;

    const result = await GetExamPackagesResponse(examPackages);
    return result;
  },

  FindOne: async (request) => {
    request = GetExamPackageRequest(request);
    const getExamPackageRequest = await Validation.validation(
      ExamPackageValidation.GET_EXAM_PACKAGE,
      request
    );

    console.info(getExamPackageRequest.exam_package_name);

    const result = await ExamPackageModel.findUnique({
      where: {
        exam_package_name: getExamPackageRequest.exam_package_name,
      },
    });

    if (!result) ThrowError(404, "Exam Package Not Found");

    return result;
  },

  Update: async (request) => {
    request = UpdateExamPackageRequest(request);
    console.info(request);
  },
};

export default ExamPackageService;
