import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hashPassword, prisma } from "../helpers/utils";

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["MANAGER", "EMPLOYEE"]),
});

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["MANAGER", "EMPLOYEE"]).optional(),
});

export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role: currentUserRole, storeId } = request.user;

      if (!["OWNER", "MANAGER"].includes(currentUserRole)) {
        return reply.status(403).send({
          message: "Only owners and managers can create users",
        });
      }

      const userData = createUserSchema.safeParse(request.body);
      if (!userData.success) {
        return reply.status(400).send({
          message: "Invalid input",
          errors: userData.error.errors,
        });
      }

      if (currentUserRole === "MANAGER") {
        if (userData.data.role !== "EMPLOYEE") {
          return reply.status(403).send({
            message: "Managers can only create employees",
          });
        }
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: userData.data.email },
      });

      if (existingUser) {
        return reply.status(400).send({ message: "Email already registered" });
      }

      const user = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: userData.data.name,
            email: userData.data.email,
            password: await hashPassword(userData.data.password),
          },
        });

        await tx.userStore.create({
          data: {
            userId: user.id,
            storeId,
            role: userData.data.role,
          },
        });

        return user;
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userData.data.role,
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

  async list(request: FastifyRequest) {
    const { storeId } = request.user;

    const users = await prisma.userStore.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return users.map(({ user, role }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    }));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role: currentUserRole, storeId } = request.user;
      const { id } = z.object({ id: z.string() }).parse(request.params);

      if (!["OWNER", "MANAGER"].includes(currentUserRole)) {
        return reply.status(403).send({
          message: "Only owners and managers can update users",
        });
      }

      const userStore = await prisma.userStore.findFirst({
        where: {
          userId: Number(id),
          storeId,
        },
        include: {
          user: true,
        },
      });

      if (!userStore) {
        return reply.status(404).send({ message: "User not found" });
      }

      const updateData = updateUserSchema.safeParse(request.body);
      if (!updateData.success) {
        return reply.status(400).send({
          message: "Invalid input",
          errors: updateData.error.errors,
        });
      }

      if (currentUserRole === "MANAGER") {
        if (userStore.role !== "EMPLOYEE") {
          return reply.status(403).send({
            message: "Managers can only update employees",
          });
        }

        if (updateData.data.role && updateData.data.role !== "EMPLOYEE") {
          return reply.status(403).send({
            message: "Managers cannot change user role to non-employee",
          });
        }
      }

      if (
        updateData.data.email &&
        updateData.data.email !== userStore.user.email
      ) {
        const existingUser = await prisma.user.findUnique({
          where: { email: updateData.data.email },
        });

        if (existingUser) {
          return reply
            .status(400)
            .send({ message: "Email already registered" });
        }
      }

      const updatedUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: Number(id) },
          data: {
            name: updateData.data.name,
            email: updateData.data.email,
            ...(updateData.data.password && {
              password: await hashPassword(updateData.data.password),
            }),
          },
        });

        if (updateData.data.role) {
          await tx.userStore.update({
            where: {
              userId_storeId: {
                userId: user.id,
                storeId,
              },
            },
            data: { role: updateData.data.role },
          });
        }

        return {
          user,
          role: updateData.data.role || userStore.role,
        };
      });

      return {
        id: updatedUser.user.id,
        name: updatedUser.user.name,
        email: updatedUser.user.email,
        role: updatedUser.role,
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

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role: currentUserRole, storeId } = request.user;
      const { id } = z.object({ id: z.string() }).parse(request.params);

      if (!["OWNER", "MANAGER"].includes(currentUserRole)) {
        return reply.status(403).send({
          message: "Only owners and managers can delete users",
        });
      }

      const userStore = await prisma.userStore.findFirst({
        where: {
          userId: Number(id),
          storeId,
        },
      });

      if (!userStore) {
        return reply.status(404).send({ message: "User not found" });
      }

      if (currentUserRole === "MANAGER") {
        if (userStore.role !== "EMPLOYEE") {
          return reply.status(403).send({
            message: "Managers can only delete employees",
          });
        }
      }

      if (userStore.role === "OWNER") {
        const ownersCount = await prisma.userStore.count({
          where: {
            storeId,
            role: "OWNER",
          },
        });

        if (ownersCount <= 1) {
          return reply
            .status(400)
            .send({ message: "Cannot delete the last owner" });
        }
      }

      await prisma.$transaction(async (tx) => {
        await tx.userStore.delete({
          where: {
            userId_storeId: {
              userId: Number(id),
              storeId,
            },
          },
        });

        const otherStores = await tx.userStore.count({
          where: { userId: Number(id) },
        });

        if (otherStores === 0) {
          await tx.user.delete({
            where: { id: Number(id) },
          });
        }
      });

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
