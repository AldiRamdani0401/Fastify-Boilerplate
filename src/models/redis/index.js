// import { Client, Entity, Schema, Repository } from "redis-om";
// import config from "../../app/config.js";

// // Create Connection
// const RedisClient = new Client();
// await RedisClient.open("redis://localhost:6379");

// // Define Schema Model
// class Access extends Entity {}

// const accessSchema = new Schema(Access, {
//   role: { type: "string" },
//   username: { type: "string" },
// });

// RedisClient.on("connect", () => console.log("🔗 Redis connected"));
// RedisClient.on("error", (err) => console.error("❌ Redis error:", err));

// export default RedisClient;
