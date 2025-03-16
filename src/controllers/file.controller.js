import FileHandler from "../handlers/file.handler.js";
import ThrowError from "../errors/throw.error.js";
import ResponseHandler from "../handlers/response.handler.js";
import config from "../app/config.js";
import ResponseFileHandler from "../handlers/response.file.handler.js";

const FileController = {
  uploadFile: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();

      await FileHandler.uploadSingleFile(request.raw, response.raw);

      const fileData = request.raw.file;
      const fileType = request.params.type;

      if (!fileData) {
        ThrowError(400, "No file uploaded");
      }

      const savedFileName = request.raw.savedFileName;

      ResponseHandler(response, {
        code: 201,
        message: "File uploaded successfully",
        timeRequest: requestTime,
        datas: {
          filename: fileData.originalname,
          size: `${(fileData.size / 1024).toFixed(2)} KB`,
          type: fileData.mimetype,
          path: `${config.BASE_URL}/files/${fileType}/${savedFileName}`,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  showFile: async (request, response) => {
    try {
      const fileType = request.params.type;
      const fileName = request.params["*"];

      const { stream, size } = await FileHandler.load(fileType, fileName);

      ResponseFileHandler(response, stream, fileName, "inline", size);
    } catch (error) {
      throw error;
    }
  },
  updateFile: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();

      const fileType = request.params.type;
      const owner = request.params.owner;
      const oldFileName = request.params["*"];

      const file = await request.file(); // get uploaded file

      if (!fileType || !owner || !oldFileName || !file) {
        ThrowError(
          400,
          "Missing fileType, owner, oldFileName, or file content"
        );
      }

      const buffer = await file.toBuffer();

      const fileWithBuffer = {
        ...file,
        buffer,
      };

      const updatedFile = await FileHandler.change(
        fileType,
        owner,
        oldFileName,
        fileWithBuffer
      );

      ResponseHandler(response, {
        code: 200,
        message: "File updated and renamed successfully",
        timeRequest: requestTime,
        datas: {
          filename: updatedFile,
          path: `${config.BASE_URL}/files/${fileType}/${updatedFile}`,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  deleteFile: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();

      const fileType = request.params.type;
      const fileName = request.params["*"];

      await FileHandler.delete(fileType, fileName);

      ResponseHandler(response, {
        code: 201,
        message: "File deleted successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default FileController;
