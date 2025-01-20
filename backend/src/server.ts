import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import appRoutes from "./routes";

const app = fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: "all",
      coerceTypes: true,
      useDefaults: true,
    },
  },
});

const prisma = new PrismaClient();

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

app.decorate("prisma", prisma);

app.register(cors, {
  origin: true,
  credentials: true,
});

app.register(appRoutes);

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: 5050, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:5050");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
