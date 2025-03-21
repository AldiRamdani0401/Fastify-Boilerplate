import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const ExamEventModel = Database.postgresClient.examEvent;

// REQUEST //
export const CreateExamEventRequest = (request) => ({
    exam_event_name: request.exam_event_name,
    exam_package_id: request.exam_package_id,
    owner: String(Mandatory(request.owner, "Owner")),
    admins: JSON.parse(Mandatory(request.admins, "Admins")),
    proctors: JSON.parse(Mandatory(request.proctors, "Proctors")),
    examinees: JSON.parse(Mandatory(request.examinees, "Examinees")),
    start_time: new Date(request.start_time).toISOString(),
    end_time: new Date(request.end_time).toISOString(),
});
