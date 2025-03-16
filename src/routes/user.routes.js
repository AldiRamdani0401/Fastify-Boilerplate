import UserController from "../controllers/user.controller.js";
import RoleMiddleware from "../middlewares/role.middleware.js";

async function UserRoutes(fastify, options) {
  // fastify.addHook("preHandler", async (request) => {
  //   RoleMiddleware("admin", request);
  // });

  fastify.get("/users", UserController.getAllUsers);
  fastify.get("/users/:user", UserController.getUser);
  fastify.patch("/users/:user", UserController.updateUser);
  fastify.delete("/users/:user", UserController.deleteUser);
}

export default UserRoutes;
