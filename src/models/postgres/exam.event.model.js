import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamEventModel = Database.postgresClient.examEvent;

// REQUEST //
export const CreateExamEventRequest = (request) => ({
  exam_event_name: String(Mandatory(request.exam_event_name, "Event Name")),
  exam_package_id: String(
    Mandatory(request.exam_package_id, "Exam Package Id")
  ),
  owner: String(Mandatory(request.owner, "Owner")),
  admins: Array.isArray(Mandatory(request.admins, "Admins")) ? request.admins : [],
  proctors: Array.isArray(Mandatory(request.proctors, "Proctors")) ? request.proctors : [],
  examinee_categories: Array.isArray(Mandatory(request.examinee_categories, "Examinee Category")) ? request.examinee_categories : [],
  start_time: new Date(
    Mandatory(request.start_time, "Start Time")
  ).toISOString(),
  end_time: new Date(Mandatory(request.end_time, "End Time")).toISOString(),
});

export const GetExamEventsRequest = (request) => ({
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

export const GetExamEventRequest = (request) => ({
  exam_event_name: String(Mandatory(request.event, "Event Name")),
});

export const UpdateExamEventRequest = (request) => ({
  param: {
    exam_event_name: String(Mandatory(request.params.exam_event_name)),
  },
  datas: {
    ...(request.body.exam_event_name && {
      exam_event_name: String(request.body.exam_event_name),
    }),
    ...(request.body.exam_package_id && {
      exam_package_id: String(request.body.exam_package_id),
    }),
    ...(request.body.owner && {
      owner: String(request.body.owner),
    }),
    ...(request.body.admins && {
      admins: Array.isArray(request.body.admins) ? request.body.admins : [],
    }),
    ...(request.body.proctors && {
      proctors: Array.isArray(request.body.proctors) ? request.body.proctors : [],
    }),
    ...(request.body.examinee_categories && {
      examinee_categories: Array.isArray(request.body.examinee_categories) ? request.body.examinee_categories : [],
    }),
    ...(request.body.start_time && {
      start_time: new Date(request.body.start_time).toISOString(),
    }),
    ...(request.body.end_time && {
      end_time: new Date(request.body.end_time).toISOString(),
    }),
  },
});

// RESPONSE //
export const GetExamEventsResponse = async (examEvents) => ({
  list: examEvents.map((examEvent) => ({
    ...examEvent,
  })),
  total_page: Number(examEvents.totalPage),
  total_datas: Number(examEvents.totalDatas),
});
