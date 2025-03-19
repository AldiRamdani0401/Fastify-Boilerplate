import ExamController from "../controllers/exam.controller.js";

async function ExamRoutes(fastify, options) {
  fastify.post("/exams", ExamController.createExams);
  fastify.get("/exams", ExamController.getAllExams);
  fastify.post("/exams/categories", ExamController.createExamCategory);
  fastify.get("/exams/categories", ExamController.getAllCategories);
  fastify.get("/exams/categories/:category", ExamController.getDetailCategory);
}

export default ExamRoutes;
