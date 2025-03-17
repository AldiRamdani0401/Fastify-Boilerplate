import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamModel = Database.postgresClient.exam;

// REQUEST //
export const CreateExamsRequest = (exams) => {
  let examPackages = exams.course_packages.replace(/\t/g, "");
  examPackages = JSON.parse(examPackages);
  examPackages = examPackages.exam_packages;

  examPackages = examPackages.map((exam) => ({
    exam_category: String(Mandatory(exams.course, "Exam Category")),
    exam_type: String(Mandatory(exam.exam_type, "Exam Type")),
    field: String(Mandatory(exam.question, "Field (Question)")),
    answers: Array(
      Mandatory(
        Array.isArray(exam.answers) ? exam.answers : [exam.answers],
        "Answer"
      )
    ),
  }));
  //   console.info(examPackages);

  return examPackages;
};
