import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import { clientRoutes } from "./client.routes";
import { saleRoutes } from "./sale.routes";
import { authenticate } from "../middlewares/auth";
import { paymentRoutes } from "./payment.routes";
import { storeRoutes } from "./store.routes";
import { userRoutes } from "./user.routes";
import { UserController } from "../controllers/user-controller";

export default async function appRoutes(app: FastifyInstance) {
  // Decorate the request with user
  app.decorateRequest("user", null);

  // Public health check route
  app.get("/", async () => {
    return { status: "Server is running" };
  });

  // Public authentication routes
  app.register(authRoutes, { prefix: "/auth" });

  app.post("/users/super", async (request, reply) => {
    const userController = new UserController();
    return userController.createSuperUser(request, reply);
  });

  // Protected routes
  app.register(async function (protectedRoutes) {
    protectedRoutes.addHook("onRequest", authenticate);

    protectedRoutes.register(clientRoutes, { prefix: "/clients" });
    protectedRoutes.register(saleRoutes, { prefix: "/sales" });
    protectedRoutes.register(paymentRoutes, { prefix: "/payments" });
    protectedRoutes.register(storeRoutes, { prefix: "/store" });
    protectedRoutes.register(userRoutes, { prefix: "/users" });
  });
}
