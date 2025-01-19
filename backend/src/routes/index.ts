import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import { clientRoutes } from "./client.routes";
import { authenticate } from "../middlewares/auth";

export default async function appRoutes(app: FastifyInstance) {
  // Decorate the request with user
  app.decorateRequest("user", null);

  // Public health check route
  app.get("/", async () => {
    return { status: "Server is running" };
  });

  // Public authentication routes
  app.register(authRoutes, { prefix: "/auth" });

  // Protected routes
  app.register(async function (protectedRoutes) {
    protectedRoutes.addHook("onRequest", authenticate);

    protectedRoutes.register(clientRoutes, { prefix: "/clients" });
  });
}
