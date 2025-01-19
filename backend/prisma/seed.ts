import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/helpers/utils";

const prisma = new PrismaClient();

async function main() {
  // Create initial store
  const store = await prisma.store.create({
    data: {
      name: "Example Store",
      image: "https://picsum.photos/200",
    },
  });

  // Create users with different roles
  const users = await Promise.all([
    // Owner user
    prisma.user.create({
      data: {
        name: "Store Owner",
        email: "owner@example.com",
        password: await hashPassword("owner123"),
      },
    }),
    // Manager user
    prisma.user.create({
      data: {
        name: "Store Manager",
        email: "manager@example.com",
        password: await hashPassword("manager123"),
      },
    }),
    // Employee user
    prisma.user.create({
      data: {
        name: "Store Employee",
        email: "employee@example.com",
        password: await hashPassword("employee123"),
      },
    }),
  ]);

  // Link users to store with different roles
  await Promise.all([
    // Link owner
    prisma.userStore.create({
      data: {
        userId: users[0].id,
        storeId: store.id,
        role: "OWNER",
      },
    }),
    // Link manager
    prisma.userStore.create({
      data: {
        userId: users[1].id,
        storeId: store.id,
        role: "MANAGER",
      },
    }),
    // Link employee
    prisma.userStore.create({
      data: {
        userId: users[2].id,
        storeId: store.id,
        role: "EMPLOYEE",
      },
    }),
  ]);

  // Create some test clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "John Doe",
        phone: "1234567890",
        birthDate: new Date("1990-01-01"),
        observations: "Regular customer",
        storeId: store.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "Jane Smith",
        phone: "0987654321",
        birthDate: new Date("1985-05-15"),
        observations: "Prefers evening appointments",
        storeId: store.id,
      },
    }),
  ]);

  // Create some sales and payments
  const sale1 = await prisma.sale.create({
    data: {
      value: 150.0,
      description: "First sale",
      isPaid: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      storeId: store.id,
      clientId: clients[0].id,
      userId: users[2].id, // Made by employee
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      value: 200.0,
      description: "Second sale",
      isPaid: true,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      storeId: store.id,
      clientId: clients[1].id,
      userId: users[1].id, // Made by manager
      payments: {
        create: {
          value: 200.0,
          payDate: new Date(),
        },
      },
    },
  });

  console.log("Seed completed successfully!");
  console.log({
    store: { id: store.id, name: store.name },
    users: users.map((u) => ({ id: u.id, email: u.email, name: u.name })),
    clients: clients.map((c) => ({ id: c.id, name: c.name })),
    sales: [
      { id: sale1.id, value: sale1.value, isPaid: sale1.isPaid },
      { id: sale2.id, value: sale2.value, isPaid: sale2.isPaid },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
