import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(cors, {
  origin: true,
});

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: 5050, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
