import { FastifyInstance } from "fastify";
import { PaymentController } from "../controllers/payment-controller";

export async function paymentRoutes(app: FastifyInstance) {
  const paymentController = new PaymentController();

  app.post("/", paymentController.create);
  app.delete("/:id", paymentController.delete);
  app.get("/sale/:saleId", paymentController.listBySale);
  app.get("/client/:clientId", paymentController.listByClient);
  app.get("/", paymentController.listByStore);
}
