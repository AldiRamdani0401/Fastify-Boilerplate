import server from "./app/app.js";
import config from "./app/config.js";

server.listen({ port: config.PORT }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
