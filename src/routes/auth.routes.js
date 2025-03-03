import AuthController from "../controllers/auth.controller.js";

async function AuthRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
  
  fastify.post("/auth/register", AuthController.register);
  fastify.post("/auth/login", AuthController.login);
}

export default AuthRoutes;
