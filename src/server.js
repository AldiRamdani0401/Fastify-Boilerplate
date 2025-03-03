import server from "./app/app.js";
import config from "./app/config.js";
import Database from "./app/database.js";

server.listen({ port: config.PORT }, async (err, address) => {
  await Database.checkDatabaseConnection(server);
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
