import Database from "../../app/database.js";
import ThrowError from "../../errors/throw.error.js";
import { Mandatory } from "../../utils/types.js";

export const FaceRecognitionModel = Database.postgresClient.face;

// REQUEST //
export const CreateFaceRequest = (face) => {
  // Validasi descriptor dengan Mandatory untuk memastikan ada
  const descriptor = Mandatory(face?.descriptor, "Descriptor");

  // Pastikan descriptor adalah array
  if (!Array.isArray(descriptor)) {
    ThrowError(400, "Descriptor must be an array of floats");
  }

  // Pastikan setiap elemen di dalam descriptor adalah angka (float)
  if (!descriptor.every((item) => typeof item === "number")) {
    ThrowError(400, "Descriptor array must contain only numbers");
  }

  // Mengembalikan objek face dengan username dan descriptor yang valid
  return {
    username: String(Mandatory(face?.username, "Username")),
    descriptor,
  };
};

// Mengambil deskriptor dari database
export const getDescriptorsFromDatabase = async (username = null) => {
  try {
    const faces = await FaceRecognitionModel.findMany({
      where: username ? { username } : {}, // kalau username tidak diberikan, ambil semua
    });

    if (!faces || faces.length === 0) {
      throw new Error("No face descriptors found in the database");
    }

    return faces.map((face) => ({
      id: face.id,
      username: face.username,
      descriptor: face.descriptor,
    }));
  } catch (error) {
    throw new Error(
      "Failed to retrieve face descriptors from database: " + error.message
    );
  }
};
