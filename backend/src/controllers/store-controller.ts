import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../helpers/utils";

const createStoreSchema = z.object({
  name: z.string().min(3),
  image: z.string().url().optional(),
});

const updateStoreSchema = z.object({
  name: z.string().min(3).optional(),
  image: z.string().url().optional(),
});

export class StoreController {
  async getMetrics(request: FastifyRequest) {
    try {
      const { storeId } = request.user;
      const { startDate, endDate } = request.query as {
        startDate?: string;
        endDate?: string;
      };

      const dateFilter = {
        ...(startDate && {
          gte: new Date(startDate),
        }),
        ...(endDate && {
          lte: new Date(endDate),
        }),
      };

      const [totalDebits, totalPayments, topSales, totalClients] =
        await Promise.all([
          prisma.client.aggregate({
            where: {
              storeId,
              debitBalance: { gt: 0 },
            },
            _sum: {
              debitBalance: true,
            },
          }),

          prisma.payment.aggregate({
            where: {
              sale: {
                storeId,
                ...(Object.keys(dateFilter).length > 0 && {
                  saleDate: dateFilter,
                }),
              },
            },
            _sum: {
              value: true,
            },
          }),

          prisma.sale.findMany({
            where: {
              storeId,
              ...(Object.keys(dateFilter).length > 0 && {
                saleDate: dateFilter,
              }),
            },
            orderBy: {
              value: "desc",
            },
            take: 5,
            include: {
              client: {
                select: {
                  name: true,
                },
              },
            },
          }),

          prisma.client.count({
            where: {
              storeId,
              debitBalance: { gt: 0 },
            },
          }),
        ]);

      return {
        totalDebits: totalDebits._sum.debitBalance || 0,
        totalPayments: totalPayments._sum.value || 0,
        totalClientsWithDebit: totalClients,
        topSales,
        period: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      };
    } catch (error) {
      request.log.error(error, "Error getting store metrics");
      throw error;
    }
  }

  async getDetails(request: FastifyRequest, reply: FastifyReply) {
    const { storeId } = request.user;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        _count: {
          select: {
            clients: true,
            sales: true,
          },
        },
      },
    });

    if (!store) {
      return reply.status(404).send({ message: "Store not found" });
    }

    return {
      id: store.id,
      name: store.name,
      image: store.image,
      totalClients: store._count.clients,
      totalSales: store._count.sales,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    };
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, id: userId } = request.user;

      if (role !== "OWNER") {
        return reply
          .status(403)
          .send({ message: "Only owners can create stores" });
      }

      const storeData = createStoreSchema.parse(request.body);

      const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.create({
          data: {
            name: storeData.name,
            image: storeData.image,
          },
        });

        await tx.userStore.create({
          data: {
            userId,
            storeId: store.id,
            role: "OWNER",
          },
        });

        return store;
      });

      return store;
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

      if (role !== "OWNER") {
        return reply
          .status(403)
          .send({ message: "Only owners can delete stores" });
      }

      const [salesCount, clientsCount] = await Promise.all([
        prisma.sale.count({ where: { storeId } }),
        prisma.client.count({ where: { storeId } }),
      ]);

      if (salesCount > 0 || clientsCount > 0) {
        return reply.status(400).send({
          message: "Cannot delete store with existing sales or clients",
        });
      }

      await prisma.$transaction(async (tx) => {
        await tx.userStore.deleteMany({
          where: { storeId },
        });

        await tx.store.delete({
          where: { id: storeId },
        });
      });

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, storeId } = request.user;

      if (role !== "OWNER") {
        return reply
          .status(403)
          .send({ message: "Only owners can update store details" });
      }

      const storeData = updateStoreSchema.parse(request.body);

      if (Object.keys(storeData).length === 0) {
        return reply
          .status(400)
          .send({ message: "No data provided for update" });
      }

      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return reply.status(404).send({ message: "Store not found" });
      }

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: {
          name: storeData.name,
          image: storeData.image,
        },
      });

      return {
        id: updatedStore.id,
        name: updatedStore.name,
        image: updatedStore.image,
        updatedAt: updatedStore.updatedAt,
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
}
