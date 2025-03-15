import RoleController from "../controllers/role.controller.js";

async function RoleRoutes(fastify, options) {
    fastify.post("/roles", RoleController.createRole);
    fastify.get("/roles", RoleController.getAllRoles);
    fastify.get("/roles/:role", RoleController.getRole);
    fastify.patch("/roles/:role", RoleController.updateRole);
}

export default RoleRoutes;