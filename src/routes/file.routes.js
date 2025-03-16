import FileController from "../controllers/file.controller.js";

async function FileRoutes(fastify, options) {
  fastify.post("/files/:type/:owner", FileController.uploadFile);
  fastify.get("/files/:type/*", FileController.showFile);
  fastify.put("/files/:type/:owner/*", FileController.updateFile);
  fastify.delete("/files/:type/*", FileController.deleteFile);
}

export default FileRoutes;
