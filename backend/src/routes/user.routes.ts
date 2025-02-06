import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";

const userController = new UserController();

export async function userRoutes(app: FastifyInstance) {
  app.post("/", userController.create);
  app.put("/:id", userController.update);
  app.delete("/:id", userController.delete);
  app.get("/", userController.list);
}
