import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamPackageModel = Database.postgresClient.examPackage;

// REQUEST //
export const CreateExamPackageRequest = (request) => ({
  exam_package_name: String(
    Mandatory(request.exam_package_name, "Exam Package Name")
  ),
  owner: String(Mandatory(request.owner, "Owner")),
  admins: JSON.parse(Mandatory(request.admins, "Admins")),
  exam_package_questions: JSON.parse(
    Mandatory(request.exam_package_questions, "Exam Package Questions")
  ),
  max_duration: Number(Mandatory(request.max_duration, "Max Duration")),
});

export const GetExamPackagesRequest = (request) => ({
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
    order: () => {
      const order = Number(
        request.query.order.replace(/^['"]+|['"]+$/g, "").trim()
      );
      if (order === 1) return "asc";
      if (order === 2) return "desc";
      return undefined;
    },
  }),
});

export const GetExamPackageRequest = (request) => ({
  exam_package_name: String(Mandatory(request.packageId, "Package ID")),
});

export const UpdateExamPackageRequest = (request) => ({});

// RESPONSE //
export const GetExamPackagesResponse = async (examPackages) => ({
  list: examPackages.map((examPackage) => ({
    ...examPackage,
  })),
  total_page: Number(examPackages.totalPage),
  total_datas: Number(examPackages.totalDatas),
});
