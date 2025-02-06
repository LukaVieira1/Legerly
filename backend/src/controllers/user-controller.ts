import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hashPassword, prisma } from "../helpers/utils";

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["OWNER", "MANAGER", "EMPLOYEE"]),
  storeId: z.number(),
});

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["MANAGER", "EMPLOYEE"]).optional(),
  storeId: z.number().optional(),
});

export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { role: currentUserRole, storeId: currentUserStoreId } =
        request.user;

      if (!["ADMIN", "OWNER", "MANAGER"].includes(currentUserRole)) {
        return reply.status(403).send({
          message: "Only admins, owners and managers can create users",
        });
      }

      const userData = createUserSchema.safeParse(request.body);
      if (!userData.success) {
        return reply.status(400).send({
          message: "Invalid input",
          errors: userData.error.errors,
        });
      }

      if (currentUserRole !== "ADMIN") {
        if (userData.data.storeId !== currentUserStoreId) {
          return reply.status(403).send({
            message: "You can only create users for your own store",
          });
        }
      }

      const store = await prisma.store.findUnique({
        where: { id: userData.data.storeId },
      });

      if (!store) {
        return reply.status(400).send({ message: "Store not found" });
      }

      if (currentUserRole === "MANAGER") {
        if (userData.data.role !== "EMPLOYEE") {
          return reply.status(403).send({
            message: "Managers can only create employees",
          });
        }
      }

      if (currentUserRole === "OWNER") {
        if (!["MANAGER", "EMPLOYEE"].includes(userData.data.role)) {
          return reply.status(403).send({
            message: "Owners can only create managers and employees",
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
            storeId: userData.data.storeId,
            role: userData.data.role,
          },
        });

        await tx.store.create({
          data: {
            name: "Default Store",
            users: {
              create: {
                userId: user.id,
                role: "ADMIN",
              },
            },
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

  async createSuperUser(request: FastifyRequest, reply: FastifyReply) {
    const createSuperUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      secretKey: z.string(),
    });

    try {
      const { name, email, password, secretKey } = createSuperUserBody.parse(
        request.body
      );

      const envSecretKey = process.env.SUPER_USER_SECRET;
      if (!envSecretKey || secretKey !== envSecretKey) {
        return reply.status(403).send({
          error: "Invalid secret key",
        });
      }

      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return reply.status(400).send({ error: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        await tx.store.create({
          data: {
            name: "Default Store",
            users: {
              create: {
                userId: user.id,
                role: "ADMIN",
              },
            },
          },
        });

        return user;
      });

      return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "ADMIN",
      });
    } catch (error) {
      return reply.status(500).send({ error: "Internal server error" });
    }
  }
}
