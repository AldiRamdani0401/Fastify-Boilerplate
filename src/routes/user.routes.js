import UserController from "../controllers/user.controller.js";

async function UserRoutes(fastify, options) {
  fastify.get("/users", UserController.getAllUsers);
  fastify.get("/users/:user", UserController.getUser);
  fastify.patch("/users/:user", UserController.updateUser);
  fastify.delete("/users/:user", UserController.deleteUser);
}

export default UserRoutes;