async function PublicRoutes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
}

export default PublicRoutes;
