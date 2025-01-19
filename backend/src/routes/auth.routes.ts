import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth-controller";

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();

  app.post("/login", authController.login);
  app.post("/register", authController.register);
}
