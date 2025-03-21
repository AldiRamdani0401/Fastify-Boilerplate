import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamSubCategoryModel = Database.postgresClient.examSubCategory;

// REQUEST //
export const CreateExamSubCategoryRequest = (request) => ({
  category_name: String(Mandatory(request.category, "Course Name")),
  sub_category_name: request.sub_course_name,
  ...(request.admins && { admins: JSON.parse(request.admins) }),
  import_admins: request.import_admins === "true",
});

export const GetExamSubCategoriesRequest = (request) => ({
  category_name: request.params.category,
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

export const GetExamSubCategoryRequest = (request) => ({
  category_name: request.params.category,
  sub_category_name: request.params.subcategory,
});

export const UpdateExamSubCategoryRequest = (request) => ({
  category_name: request.category_name,
  sub_category_name: request.sub_category_name,
  updated_data: {
    ...(request.course_name && {
      category_name: String(request.course_name),
    }),
    ...(request.sub_course_name && {
      sub_category_name: String(request.sub_course_name),
    }),
    ...(request.owner && { owner: String(request.owner) }),
    ...(request.admins && { admins: JSON.parse(request.admins) }),
  },
});

// RESPONSE //
export const GetExamSubCategoriesResponse = (subCategories) =>
  subCategories.map((subCategory) => ({
    sub_category_name: subCategory.sub_category_name,
    owner: subCategory.owner,
    admins: subCategory.admins,
    created_at: subCategory.createdAt,
    updated_at: subCategory.updatedAt,
    isDeleted: subCategory.isDeleted,
  }));
