import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamCategoryModel = Database.postgresClient.examCategory;

// REQUEST //
export const CreateExamCategoryRequest = (category) => ({
  category_name: String(Mandatory(category.course_name, "Course Name")),
  owner: String(Mandatory(category.owner, "Owner")),
  ...(category.admins && {
    admins: JSON.parse(category.admins),
  }),
});

export const GetExamCategoriesRequest = (request) => ({
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

export const GetExamCategoryRequest = (request) => ({
  category_name: String(Mandatory(request.category)),
});

export const UpdateExamCategoryRequest = (request) => ({
  ...(request.course_name && { category_name: String(request.course_name) }),
  ...(request.owner && { owner: String(request.owner) }),
  ...(request.admins && {
    admins: JSON.parse(request.admins).map((admin) => String(admin)),
  }),
});

// RESPONSE //
export const GetExamCategoriesResponse = async (exams) => ({
  list: exams.map((exam) => ({
    course: exam.category_name,
  })),
  total_page: Number(exams.totalPage),
  total_datas: Number(exams.totalDatas),
});

export const GetExamCategoryResponse = async (exams) => ({
  course: exams.category_name,
  owner: exams.owner,
  admins: {
    list: exams.admins,
    total_admins: exams.admins.length,
  },
  created_at: exams.createdAt,
  updated_at: exams.updatedAt,
  sub_course: exams.exam_sub_categories.map((sub) => ({
    sub_course: sub.sub_category_name,
  })),
  total_sub_course: exams.exam_sub_categories.length,
});
