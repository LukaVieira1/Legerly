import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController();

  app.post("/", userController.create);
  app.put("/:id", userController.update);
  app.delete("/:id", userController.delete);
  app.get("/", userController.list);
}
