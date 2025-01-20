import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../helpers/utils";

const createPaymentSchema = z.object({
  value: z.number().min(0),
  saleId: z.number(),
});

export class PaymentController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId } = request.user;
      const paymentData = createPaymentSchema.parse(request.body);

      const sale = await prisma.sale.findUnique({
        where: { id: paymentData.saleId },
        include: {
          client: true,
          payments: true,
        },
      });

      if (!sale || sale.storeId !== storeId) {
        return reply.status(404).send({ message: "Sale not found" });
      }

      if (sale.isPaid) {
        return reply.status(400).send({ message: "Sale is already paid" });
      }

      const totalPaid = sale.payments.reduce(
        (sum, payment) => sum + Number(payment.value),
        0
      );
      const remainingValue = Number(sale.value) - totalPaid;

      if (paymentData.value > remainingValue) {
        return reply.status(400).send({
          message: "Payment value exceeds remaining value",
          remainingValue,
        });
      }

      const payment = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            value: paymentData.value,
            payDate: new Date(),
            saleId: sale.id,
          },
        });

        if (totalPaid + paymentData.value === Number(sale.value)) {
          await tx.sale.update({
            where: { id: sale.id },
            data: { isPaid: true },
          });
        }

        await tx.client.update({
          where: { id: sale.clientId },
          data: {
            debitBalance: {
              decrement: paymentData.value,
            },
          },
        });

        return payment;
      });

      return {
        ...payment,
        sale,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Invalid input",
          errors: error.errors,
        });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async listBySale(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId } = request.user;
      const { saleId } = z.object({ saleId: z.string() }).parse(request.params);

      const sale = await prisma.sale.findUnique({
        where: { id: Number(saleId) },
      });

      if (!sale || sale.storeId !== storeId) {
        return reply.status(404).send({ message: "Sale not found" });
      }

      const payments = await prisma.payment.findMany({
        where: { saleId: Number(saleId) },
        orderBy: { payDate: "desc" },
      });

      return payments;
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, storeId } = request.user;

      if (!["OWNER", "MANAGER"].includes(role)) {
        return reply.status(403).send({ message: "Insufficient permissions" });
      }

      const { id } = z.object({ id: z.string() }).parse(request.params);

      const payment = await prisma.payment.findUnique({
        where: { id: Number(id) },
        include: { sale: true },
      });

      if (!payment || payment.sale.storeId !== storeId) {
        return reply.status(404).send({ message: "Payment not found" });
      }

      await prisma.$transaction(async (tx) => {
        await tx.payment.delete({
          where: { id: Number(id) },
        });

        await tx.sale.update({
          where: { id: payment.saleId },
          data: { isPaid: false },
        });

        await tx.client.update({
          where: { id: payment.sale.clientId },
          data: {
            debitBalance: {
              increment: payment.value,
            },
          },
        });
      });

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async listByClient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId } = request.user;
      const { clientId } = z
        .object({ clientId: z.string() })
        .parse(request.params);

      const client = await prisma.client.findUnique({
        where: { id: Number(clientId) },
      });

      if (!client || client.storeId !== storeId) {
        return reply.status(404).send({ message: "Client not found" });
      }

      const payments = await prisma.payment.findMany({
        where: {
          sale: {
            clientId: Number(clientId),
            storeId,
          },
        },
        include: {
          sale: {
            select: {
              description: true,
              value: true,
              isPaid: true,
              client: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { payDate: "desc" },
      });

      return payments;
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async listByStore(request: FastifyRequest) {
    const { storeId } = request.user;

    const payments = await prisma.payment.findMany({
      where: {
        sale: {
          storeId,
        },
      },
      include: {
        sale: {
          select: {
            description: true,
            value: true,
            isPaid: true,
            client: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { payDate: "desc" },
    });

    return payments;
  }
}
