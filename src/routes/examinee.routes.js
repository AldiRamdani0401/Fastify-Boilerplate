import ExamineeController from "../controllers/examinee.controller.js";

async function ExamineeRoutes(fastify, options) {
  // EXAMINEE EVENT //
  fastify.route({
    method: "GET",
    url: "/examinees/:examineeId/events",
    handler: ExamineeController.getAllExamineeEvents,
  });

  fastify.route({
    method: "GET",
    url: "/examinees/:examineeId/:eventId",
    handler: ExamineeController.getDetailExamineeEvent,
  });
  // end of EXAMINEE EVENT //

  // EXAMINEE EVENT : EXAM PACKAGE //
  fastify.route({
    method: "POST",
    url: "/examinees/:examineeId/:eventId/:packageId",
    handler: ExamineeController.startExamineeEvent,
  });

  // fastify.route({
  //   method: "GET",
  //   url: "/examinees/:examineeId/:eventId",
  //   handler: ExamineeController.getDetailExamineeEvent,
  // });
  // end of EXAMINEE EVENT : EXAM PACKAGE //
}

export default ExamineeRoutes;
