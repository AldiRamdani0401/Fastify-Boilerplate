import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const FaceRecognitionModel = Database.postgresClient.face;

// REQUEST //
export const CreateFaceRequest = (face) => {
  const descriptor = Mandatory(face?.descriptor, "Descriptor");

  if (!Array.isArray(descriptor)) {
    throw new Error("Descriptor harus berupa array of float");
  }

  return {
    username: String(Mandatory(face?.username, "Username")),
    descriptor,
  };
};
