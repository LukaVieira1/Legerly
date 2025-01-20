import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../helpers/utils";

const createClientSchema = z.object({
  name: z.string().min(3),
  phone: z.string(),
  birthDate: z.string().transform((date) => new Date(date)),
  observations: z.string().optional(),
});

const updateClientSchema = createClientSchema.partial();

const updateObservationsSchema = z.object({
  observations: z.string(),
});

export class ClientController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, storeId } = request.user;

      if (!["OWNER", "MANAGER", "EMPLOYEE"].includes(role)) {
        return reply.status(403).send({ message: "Insufficient permissions" });
      }

      const clientData = createClientSchema.parse(request.body);

      const client = await prisma.client.create({
        data: {
          name: clientData.name,
          phone: clientData.phone,
          birthDate: clientData.birthDate,
          observations: clientData.observations,
          storeId: storeId,
        },
      });

      return client;
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
      const clientData = updateClientSchema.parse(request.body);

      const client = await prisma.client.findUnique({
        where: { id: Number(id) },
      });

      if (!client) {
        return reply.status(404).send({ message: "Client not found" });
      }

      if (client.storeId !== storeId) {
        return reply.status(403).send({ message: "Access denied" });
      }

      const updatedClient = await prisma.client.update({
        where: { id: Number(id) },
        data: clientData,
      });

      return updatedClient;
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

  async list(request: FastifyRequest) {
    const { storeId } = request.user;

    const clients = await prisma.client.findMany({
      where: { storeId },
      orderBy: { name: "asc" },
    });

    return clients;
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = z.object({ id: z.string() }).parse(request.params);

      const client = await prisma.client.findUnique({
        where: { id: Number(id) },
      });

      if (!client) {
        return reply.status(404).send({ message: "Client not found" });
      }

      return client;
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async updateObservations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role, storeId } = request.user;

      if (!["OWNER", "MANAGER", "EMPLOYEE"].includes(role)) {
        return reply.status(403).send({ message: "Insufficient permissions" });
      }

      const { id } = z.object({ id: z.string() }).parse(request.params);
      const { observations } = updateObservationsSchema.parse(request.body);

      const client = await prisma.client.findUnique({
        where: { id: Number(id) },
      });

      if (!client) {
        return reply.status(404).send({ message: "Client not found" });
      }

      if (client.storeId !== storeId) {
        return reply.status(403).send({ message: "Access denied" });
      }

      const updatedClient = await prisma.client.update({
        where: { id: Number(id) },
        data: { observations },
      });

      return updatedClient;
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

      const client = await prisma.client.findUnique({
        where: { id: Number(id) },
      });

      if (!client) {
        return reply.status(404).send({ message: "Client not found" });
      }

      if (client.storeId !== storeId) {
        return reply.status(403).send({ message: "Access denied" });
      }

      await prisma.client.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
