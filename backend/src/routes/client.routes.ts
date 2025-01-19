import { FastifyInstance } from "fastify";
import { ClientController } from "../controllers/client-controller";

export async function clientRoutes(app: FastifyInstance) {
  const clientController = new ClientController();

  app.get("/", clientController.list);
  app.post("/", clientController.create);
  app.put("/:id", clientController.update);
  app.get("/:id", clientController.getById);
  app.patch("/:id/debit-balance", clientController.updateDebt);
  app.patch("/:id/observations", clientController.updateObservations);
  app.delete("/:id", clientController.delete);
}
