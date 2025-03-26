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

  // EXAMINEE EVENT : START EXAM //
  fastify.route({
    method: "POST",
    url: "/examinees/:examineeId/:eventId/:packageId/:examCategory",
    handler: ExamineeController.startExamineeEvent,
  });

  // EXAMINEE EVENT : SUBMIT EXAM SHEET //
  fastify.route({
    method: "POST",
    url: "/examinees/:examineeId/:eventId/:packageId/:examCategory/",
    handler: ExamineeController.submitExamineeEvent,
  });

  // end of EXAMINEE EVENT : START EXAM //
}

export default ExamineeRoutes;
