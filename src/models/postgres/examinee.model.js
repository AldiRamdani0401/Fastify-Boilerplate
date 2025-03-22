import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamineeModel = Database.postgresClient.examinee;

//*** MANAGE EXAMINEE ***//
//=== REQUEST ===//
export const CreateExamineesRequest = async (request) => {
  const examinees = JSON.parse(Mandatory(request.examinees, "Examinees"));
  return examinees.map((examinee) => ({
    examinee_name: String(Mandatory(examinee.examinee_name, "Examinee Name")),
    examinee_category: String(
      Mandatory(examinee.examinee_category, "Examinee Category")
    ),
  }));
};

export const GetExamineesRequest = (request) => ({
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

export const GetExamineeRequest = (request) => ({
  examinee_id: String(Mandatory(request.examineeId, "Examinee ID")),
});

export const UpdateExamineeRequest = (request) => ({
  param: {
    examinee_id: String(Mandatory(request.param)),
  },
  datas: {
    ...(request.request.examinee_name && {
      examinee_name: String(request.request.examinee_name),
    }),
    ...(request.request.examinee_category && {
      examinee_category: String(request.request.examinee_category),
    }),
  },
});

//=== RESPONSE ===//
export const GetExamineesResponse = async (examinees) => ({
  list: examinees.map((examinee) => ({
    ...examinee,
  })),
  total_page: Number(examinees.totalPage),
  total_datas: Number(examinees.totalDatas),
});
//*** end of MANAGE EXAMINEE ***//

//*** EXAMINEE ***//
//=== REQUEST ===//
export const GetExamineeEventsRequest = (request) => ({
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

export const GetExamineeEventRequest = (request) => ({
  examinee_id: String(Mandatory(request.examineeId, "Examinee ID")),
  exam_event_name: String(Mandatory(request.eventId, "Exam Event ID")),
});

export const StartExamRequest = (request) => ({
  params: {
    examinee_id: String(Mandatory(request.params.examineeId, "Examinee ID")),
    exam_event_name: String(Mandatory(request.params.eventId, "Exam Event ID")),
    exam_package_id: String(
      Mandatory(request.params.packageId, "Exam Package ID")
    ),
  },
  datas: {
    start_exam: JSON.parse(
      Mandatory(request.formData.start_exam, "Confirm Start Exam")
    ),
    start_at: new Date().toISOString(),
  },
});

//=== RESPONSE ===//
export const GetExamineeEventsResponse = async (examineeEvents) => ({
  list: examineeEvents.map((examineeEvent) => ({
    ...examineeEvent,
  })),
  total_page: Number(examineeEvents.totalPage),
  total_datas: Number(examineeEvents.totalDatas),
});

//*** end of EXAMINEE ***//
