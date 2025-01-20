import { FastifyInstance } from "fastify";
import { StoreController } from "../controllers/store-controller";

export async function storeRoutes(app: FastifyInstance) {
  const storeController = new StoreController();

  app.get("/metrics", storeController.getMetrics);
  app.get("/details", storeController.getDetails);
  app.post("/", storeController.create);
  app.put("/", storeController.update);
  app.delete("/", storeController.delete);
}
