import ExamQuestionController from "../controllers/exam.question.controller.js";
import ExamCategoryController from "../controllers/exam.category.controller.js";
import ExamSubCategoryController from "../controllers/exam.sub.category.controller.js";
import ExamPackagesController from "../controllers/exam.packages.controller.js";
import ExamEventController from "../controllers/exam.event.controller.js";

async function ExamRoutes(fastify, options) {
  //*** EXAM QUESTION ***//
  fastify.route({
    method: "POST",
    url: "/exams/:category/:subcategory",
    handler: ExamQuestionController.createExamQuestions,
  });

  fastify.route({
    method: "GET",
    url: "/exams/:category/:subcategory",
    handler: ExamQuestionController.getAllExamQuestions,
  });

  fastify.route({
    method: "GET",
    url: "/exams/:category/:subcategory/:questionId",
    handler: ExamQuestionController.getDetailExamQuestion,
  });

  fastify.route({
    method: "PUT",
    url: "/exams/:category/:subcategory/:questionId",
    handler: ExamQuestionController.updateExamQuestion,
  });

  fastify.route({
    method: "DELETE",
    url: "/exams/:category/:subcategory/:questionId",
    handler: ExamQuestionController.deleteExamQuestion,
  });

  fastify.route({
    method: "GET",
    url: "/exams/:category/:subcategory/deleted",
    handler: ExamQuestionController.getDeletedExamQuestions,
  });
  //*** end of EXAM QUESTION ***//

  //*** EXAM PACKAGE ***//
  fastify.route({
    method: "POST",
    url: "/exams/packages",
    handler: ExamPackagesController.createExamPackage,
  });

  fastify.route({
    method: "GET",
    url: "/exams/packages",
    handler: ExamPackagesController.getAllExamPackages,
  });

  fastify.route({
    method: "GET",
    url: "/exams/packages/:packageId",
    handler: ExamPackagesController.getDetailExamPackage,
  });

  fastify.route({
    method: "PATCH",
    url: "/exams/packages/:packageId",
    handler: ExamPackagesController.updateExamPackage,
  });

  fastify.route({
    method: "DELETE",
    url: "/exams/packages/:packageId",
    handler: ExamPackagesController.deleteExamPackage,
  });
  //*** end of EXAM PACKAGE ***//

  //*** EXAM EVENT ***//
  fastify.route({
    method: "POST",
    url: "/exams/events",
    handler: ExamEventController.createExamEvent,
  });

  fastify.route({
    method: "GET",
    url: "/exams/events",
    handler: ExamEventController.getAllExamEvents,
  });

  fastify.route({
    method: "GET",
    url: "/exams/events/:event",
    handler: ExamEventController.getDetailExamEvent,
  });

  fastify.route({
    method: "PATCH",
    url: "/exams/events/:event",
    handler: ExamEventController.updateExamEvent,
  });

  fastify.route({
    method: "DELETE",
    url: "/exams/events/:event",
    handler: ExamEventController.deleteExamEvent,
  });
  //*** end of EXAM EVENT ***//

  //*** CATEGORY ***//
  fastify.route({
    method: "POST",
    url: "/exams/categories",
    handler: ExamCategoryController.createExamCategory,
  });

  fastify.route({
    method: "GET",
    url: "/exams/categories",
    handler: ExamCategoryController.getAllExamCategories,
  });

  fastify.route({
    method: "GET",
    url: "/exams/:category",
    handler: ExamCategoryController.getDetailExamCategory,
  });

  fastify.route({
    method: "PATCH",
    url: "/exams/:category",
    handler: ExamCategoryController.updateExamCategory,
  });

  fastify.route({
    method: "DELETE",
    url: "/exams/:category",
    handler: ExamCategoryController.deleteExamCategory,
  });

  fastify.route({
    method: "GET",
    url: "/exams/categories/deleted",
    handler: ExamCategoryController.getDeletedExamCategories,
  });

  fastify.route({
    method: "PATCH",
    url: "/exams/categories/restore",
    handler: ExamCategoryController.restoreDeletedExamCategories,
  });
  //*** end of CATEGORY ***//

  //*** SUB CATEGORY ***//
  fastify.route({
    method: "POST",
    url: "/exams/:category/subcategories",
    handler: ExamSubCategoryController.createExamSubCategory,
  });

  fastify.route({
    method: "GET",
    url: "/exams/:category/",
    handler: ExamSubCategoryController.getAllExamSubCategories,
  });

  fastify.route({
    method: "GET",
    url: "/exams/:category/:subcategory/",
    handler: ExamSubCategoryController.getDetailExamSubCategory,
  });

  fastify.route({
    method: "PATCH",
    url: "/exams/:category/:subcategory",
    handler: ExamSubCategoryController.updateExamSubCategory,
  });

  fastify.route({
    method: "DELETE",
    url: "/exams/:category/:subcategory",
    handler: ExamSubCategoryController.deleteExamSubCategory,
  });
  //*** end of SUB CATEGORY ***//
}

export default ExamRoutes;
