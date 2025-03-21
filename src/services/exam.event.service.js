import ThrowError from "../errors/throw.error.js";
import {
  CreateExamEventRequest,
  ExamEventModel,
} from "../models/postgres/exam.event.model.js";
import ExamEventValidation from "../validations/exam.event.validation.js";
import Validation from "../validations/validation.js";

const ExamEventService = {
  CreateExamEvent: async (request) => {
    request = CreateExamEventRequest(request);
    const createExamEventRequest = await Validation.validation(
      ExamEventValidation.CREATE_EXAM_EVENT,
      request
    );

    const existingExamEvent = await ExamEventModel.findUnique({
      where: {
        exam_event_name: createExamEventRequest.exam_event_name,
      },
    });

    if (existingExamEvent) ThrowError(400, "Exam Event Already Exists");

    const examEvent = await ExamEventModel.create({
      data: {
        ...createExamEventRequest,
      },
    });

    return examEvent;
  },
};

export default ExamEventService;
