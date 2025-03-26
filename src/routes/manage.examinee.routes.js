import ManageExamineeController from "../controllers/manage.examinee.controller.js";

async function ManageExamineeRoutes(fastify, options) {
  //*** MANAGE EXAMINEES ***//
  fastify.route({
    method: "POST",
    url: "/examinees",
    handler: ManageExamineeController.createExaminees,
  });

  fastify.route({
    method: "GET",
    url: "/examinees",
    handler: ManageExamineeController.getAllExaminees,
  });

  fastify.route({
    method: "GET",
    url: "/examinees/:examineeId",
    handler: ManageExamineeController.getDetailExaminee,
  });

  fastify.route({
    method: "PATCH",
    url: "/examinees/:examineeId",
    handler: ManageExamineeController.updateExaminee,
  });

  fastify.route({
    method: "DELETE",
    url: "/examinees/:examineeId",
    handler: ManageExamineeController.deleteExaminee,
  });
  //*** end of MANAGE EXAMINEES ***//

  //*** MANAGE EXAMINEES EXAMS (ADMIN) ***//
  fastify.route({
    method: "GET",
    url: "/examinees/:adminId/events",
    handler: ManageExamineeController.getExamEventRelatedAdmin,
  });
  //*** end of MANAGE EXAMINEES EXAMS ***//
}

export default ManageExamineeRoutes;
