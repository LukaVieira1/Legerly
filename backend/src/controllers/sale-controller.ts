import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../helpers/utils";

const createSaleSchema = z.object({
  value: z.number().min(0),
  description: z.string(),
  isPaid: z.boolean().default(false),
  dueDate: z.string().transform((date) => new Date(date)),
  clientId: z.number(),
});

const updateSaleSchema = createSaleSchema.partial();

export class SaleController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { storeId, id: userId } = request.user;
      const saleData = createSaleSchema.parse(request.body);

      const client = await prisma.client.findUnique({
        where: { id: saleData.clientId },
      });

      if (!client || client.storeId !== storeId) {
        return reply.status(404).send({ message: "Client not found" });
      }

      const sale = await prisma.$transaction(async (tx) => {
        const sale = await tx.sale.create({
          data: {
            value: saleData.value,
            description: saleData.description,
            isPaid: saleData.isPaid,
            dueDate: saleData.dueDate,
            storeId,
            clientId: saleData.clientId,
            userId,
          },
          include: {
            client: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            payments: {
              select: {
                id: true,
                value: true,
                payDate: true,
                createdAt: true,
              },
              orderBy: {
                payDate: "desc",
              },
            },
          },
        });

        if (!saleData.isPaid) {
          await tx.client.update({
            where: { id: saleData.clientId },
            data: {
              debitBalance: {
                increment: saleData.value,
              },
            },
          });
        }

        return sale;
      });

      return sale;
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

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, storeId } = request.user;

      if (!["OWNER", "MANAGER"].includes(role)) {
        return reply.status(403).send({ message: "Insufficient permissions" });
      }

      const { id } = z.object({ id: z.string() }).parse(request.params);
      const saleData = updateSaleSchema.parse(request.body);

      const sale = await prisma.sale.findUnique({
        where: { id: Number(id) },
      });

      if (!sale || sale.storeId !== storeId) {
        return reply.status(404).send({ message: "Sale not found" });
      }

      const updatedSale = await prisma.sale.update({
        where: { id: Number(id) },
        data: saleData,
        include: {
          client: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedSale;
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

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, storeId } = request.user;

      if (!["OWNER", "MANAGER"].includes(role)) {
        return reply.status(403).send({ message: "Insufficient permissions" });
      }

      const { id } = z.object({ id: z.string() }).parse(request.params);

      const sale = await prisma.sale.findUnique({
        where: { id: Number(id) },
      });

      if (!sale || sale.storeId !== storeId) {
        return reply.status(404).send({ message: "Sale not found" });
      }

      await prisma.sale.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async list(request: FastifyRequest) {
    const { storeId } = request.user;

    const sales = await prisma.sale.findMany({
      where: { storeId },
      include: {
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: {
          select: {
            id: true,
            value: true,
            payDate: true,
            createdAt: true,
          },
          orderBy: {
            payDate: "desc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sales;
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

      const sales = await prisma.sale.findMany({
        where: {
          clientId: Number(clientId),
          storeId,
        },
        include: {
          client: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: {
            select: {
              id: true,
              value: true,
              payDate: true,
              createdAt: true,
            },
            orderBy: {
              payDate: "desc",
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return sales;
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
