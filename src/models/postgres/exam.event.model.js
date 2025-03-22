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
  admins: JSON.parse(Mandatory(request.admins, "Admins")),
  proctors: JSON.parse(Mandatory(request.proctors, "Proctors")),
  examinee_categories: JSON.parse(
    Mandatory(request.examinee_categories, "Examinee Category")
  ),
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
    exam_event_name: String(Mandatory(request.param)),
  },
  datas: {
    ...(request.request.exam_event_name && {
      exam_event_name: String(request.request.exam_event_name),
    }),
    ...(request.request.exam_package_id && {
      exam_package_id: String(request.request.exam_package_id),
    }),
    ...(request.request.owner && {
      owner: String(request.request.owner),
    }),
    ...(request.request.admins && {
      admins: JSON.parse(request.request.admins),
    }),
    ...(request.request.proctors && {
      proctors: JSON.parse(request.request.proctors),
    }),
    ...(request.request.examinee_categories && {
      examinee_categories: JSON.parse(request.request.examinee_categories),
    }),
    ...(request.request.start_time && {
      start_time: new Date(request.request.start_time).toISOString(),
    }),
    ...(request.request.end_time && {
      end_time: new Date(request.request.end_time).toISOString(),
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
