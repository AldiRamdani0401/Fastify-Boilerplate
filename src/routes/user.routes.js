import UserController from "../controllers/user.controller.js";

async function UserRoutes(fastify, options) {
  fastify.get("/users", UserController.getAllUsers);
  fastify.get("/users/:id", UserController.getUserById);
}

export default UserRoutes;