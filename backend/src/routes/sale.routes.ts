import { FastifyInstance } from "fastify";
import { SaleController } from "../controllers/sale-controller";

export async function saleRoutes(app: FastifyInstance) {
  const saleController = new SaleController();

  app.get("/", saleController.list);
  app.post("/", saleController.create);
  app.put("/:id", saleController.update);
  app.delete("/:id", saleController.delete);
  app.get("/client/:clientId", saleController.listByClient);
  app.get("/:id", saleController.listById);
}
