import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamQuestionModel = Database.postgresClient.examQuestion;

// REQUEST //
export const CreateExamQuestionRequest = (params, exams) => {
  let examQuestionPackages = exams.exam_question_packages.replace(/\t/g, "");
  examQuestionPackages = JSON.parse(examQuestionPackages);

  examQuestionPackages = examQuestionPackages.map((exam) => ({
    exam_category: String(Mandatory(params.category, "Exam Category")),
    exam_sub_category: String(
      Mandatory(params.subcategory, "Exam Sub Category")
    ),
    exam_type: String(Mandatory(exam.exam_type, "Exam Type")),
    question: String(Mandatory(exam.question, "Question")),
    answers: Mandatory(
      Array.isArray(exam.answers) ? exam.answers : [exam.answers],
      "Answer"
    ),
  }));

  return examQuestionPackages;
};

export const GetExamQuestionsRequest = (request) => ({
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
  ...(request.params.category &&
    request.params.subcategory && {
      filter: {
        exam_category: String(
          Mandatory(request.params.category, "Exam Category")
        ),
        exam_sub_category: String(
          Mandatory(request.params.subcategory, "Exam Sub Category")
        ),
      },
    }),
});

export const GetExamQuestionRequest = (request) => ({
  exam_category: String(Mandatory(request.category, "Exam Category")),
  exam_sub_category: String(
    Mandatory(request.subcategory, "Exam Sub Category")
  ),
  id: Number(Mandatory(request.questionId, "Exam Question ID")),
});

export const UpdateExamQuestionRequest = (request) => ({
  params: {
    exam_category: String(Mandatory(request.params.category)),
    exam_sub_category: String(Mandatory(request.params.subcategory)),
    id: Number(Mandatory(request.params.questionId)),
  },
  datas: {
    exam_type: String(request.request.exam_type),
    question: String(request.request.question),
    answers: JSON.parse(request.request.answers),
  },
});

// RESPONSE //
export const GetExamQuestionsResponse = async (exams) => ({
  list: exams.map((exam) => ({
    id: exam.id,
    exam_type: exam.exam_type,
    field: exam.field,
    answers: exam.answers,
  })),
  total_page: Number(exams.totalPage),
  total_datas: Number(exams.totalDatas),
});
