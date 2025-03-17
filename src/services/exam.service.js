import ThrowError from "../errors/throw.error.js";
import {
  CreateExamsRequest,
  ExamModel,
} from "../models/postgres/exam.model.js";
import ExamValidation from "../validations/exam.validation.js";
import Validation from "../validations/validation.js";

const ExamService = {
  Create: async (exams) => {
    exams = CreateExamsRequest(exams);
    let createExamsRequest = [];
    for (const exam of exams) {
      await Validation.validation(ExamValidation.CREATE, exam);
      createExamsRequest.push(exam);
    }

    const existingExams = await ExamModel.findMany({
      where: {
        field: {
          in: createExamsRequest.map((exam) => exam.field),
        },
      },
      select: {
        field: true,
      },
    });

    const duplicateFields = existingExams.map((exam) => exam.field);

    if (existingExams.length > 0) {
      ThrowError(400, `Duplicate exams found : ${duplicateFields}`);
    }

    exams = await ExamModel.createMany({
      data: [...createExamsRequest],
    });

    if (!exams.count) ThrowError(500);

    exams = createExamsRequest;

    return exams;
  },
};

export default ExamService;
