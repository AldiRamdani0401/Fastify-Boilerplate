import AdminExamController from "../controllers/admin.exam.controller.js";

async function AdminExamRoutes(fastify, options) {
  //*** MANAGE EXAMINEES ***//
  fastify.route({
    method: "POST",
    url: "/manage/examinees",
    handler: AdminExamController.Examinee.Create,
  });

  fastify.route({
    method: "GET",
    url: "/manage/examinees",
    handler: AdminExamController.Examinee.GetAll,
  });

  fastify.route({
    method: "GET",
    url: "/manage/examinees/:examineeId",
    handler: AdminExamController.Examinee.GetDetail,
  });

  fastify.route({
    method: "PATCH",
    url: "/manage/examinees/:examineeId",
    handler: AdminExamController.Examinee.Update,
  });

  fastify.route({
    method: "DELETE",
    url: "/manage/examinees/:examineeId",
    handler: AdminExamController.Examinee.Delete,
  });
  //*** end of MANAGE EXAMINEES ***//

  //*** MANAGE EXAMINEES EXAMS (ADMIN) ***//
  fastify.route({
    method: "GET",
    url: "/manage/examinees/:adminId/events",
    handler: AdminExamController.getExamEventsRelatedAdmin,
  });

  fastify.route({
    method: "GET",
    url: "/manage/examinees/:adminId/:eventId",
    handler: AdminExamController.getDetailExamEventRelatedAdmin,
  });
  //*** end of MANAGE EXAMINEES EXAMS ***//
}

export default AdminExamRoutes;
