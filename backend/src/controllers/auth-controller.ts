import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  comparePassword,
  createAccessToken,
  hashPassword,
  prisma,
} from "../helpers/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  storeId: z.number(),
  role: z.enum(["OWNER", "MANAGER", "EMPLOYEE"]),
});

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = loginSchema.parse(request.body);

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          stores: {
            include: {
              store: true,
            },
          },
        },
      });

      if (!user) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const userStore = user.stores[0];
      if (!userStore) {
        return reply
          .status(401)
          .send({ message: "User not associated with any store" });
      }

      const token = await createAccessToken({
        id: user.id,
        role: userStore.role,
        storeId: userStore.storeId,
      });

      if (!token) {
        return reply.status(500).send({ message: "Error generating token" });
      }

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userStore.role,
          store: userStore.store,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ message: "Invalid input", errors: error.errors });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userData = registerSchema.parse(request.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        return reply.status(400).send({ message: "Email already registered" });
      }

      const store = await prisma.store.findUnique({
        where: { id: userData.storeId },
      });

      if (!store) {
        return reply.status(404).send({ message: "Store not found" });
      }

      const hashedPassword = await hashPassword(userData.password);

      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          stores: {
            create: {
              storeId: userData.storeId,
              role: userData.role,
            },
          },
        },
        include: {
          stores: {
            include: {
              store: true,
            },
          },
        },
      });

      const token = await createAccessToken({
        id: user.id,
        role: userData.role,
        storeId: userData.storeId,
      });

      if (!token) {
        return reply.status(500).send({ message: "Error generating token" });
      }

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userData.role,
          store: user.stores[0].store,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ message: "Invalid input", errors: error.errors });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
