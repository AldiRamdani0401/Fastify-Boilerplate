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
    exam_sub_category: String(Mandatory(exams.sub_course, "Exam Sub Category")),
    exam_type: String(Mandatory(exam.exam_type, "Exam Type")),
    field: String(Mandatory(exam.question, "Field (Question)")),
    answers: Mandatory(
      Array.isArray(exam.answers) ? exam.answers : [exam.answers],
      "Answer"
    ),
  }));

  return examPackages;
};

export const GetExamsRequest = (request) => ({
  page: Number(request.query.page?.replace(/^['"]+|['"]+$/g, "").trim() ?? 1),
  limit: Number(
    request.query.limit?.replace(/^['"]+|['"]+$/g, "").trim() ?? 10
  ),
  ...(request.query.search && {
    search:
      String(request.query.search)
        .replace(/^['"]+|['"]+$/g, "")
        .trim() || undefined,
  }),
  ...(request.query.order && {
    order: (() => {
      const order = Number(
        request.query.order.replace(/^['"]+|['"]+$/g, "").trim()
      );
      if (order === 1) return "asc";
      if (order === 2) return "desc";
      return undefined;
    })(),
  }),
});

// RESPONSE //
export const GetExamsResponse = async (exams) => ({
  courses: exams.map((exam) => ({
    course: exam.category_name,
  })),
  total_page: Number(exams.totalPage),
  total_datas: Number(exams.totalDatas),
});
