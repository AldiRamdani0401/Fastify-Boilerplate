import ExamController from "../controllers/exam.controller.js";

async function ExamRoutes(fastify, options) {
  fastify.post("/exams", ExamController.createExams);
}

export default ExamRoutes;
