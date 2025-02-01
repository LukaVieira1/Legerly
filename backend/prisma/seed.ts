import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/helpers/utils";

const prisma = new PrismaClient();

const RANDOM_FIRST_NAMES = [
  "Miguel",
  "Sofia",
  "Arthur",
  "Helena",
  "Bernardo",
  "Valentina",
  "Heitor",
  "Laura",
  "Davi",
  "Isabella",
  "Lorenzo",
  "Manuela",
  "Théo",
  "Júlia",
  "Pedro",
  "Alice",
  "Gabriel",
  "Clara",
  "Enzo",
  "Luiza",
  "Matheus",
  "Beatriz",
  "Lucas",
  "Maria",
  "Benjamin",
  "Cecília",
  "Nicolas",
  "Eloá",
  "Guilherme",
  "Lara",
  "Rafael",
  "Mariana",
  "Joaquim",
  "Lívia",
  "Samuel",
  "Heloísa",
  "Enzo",
  "Maria",
  "João",
  "Melissa",
];

const RANDOM_LAST_NAMES = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Rodrigues",
  "Ferreira",
  "Alves",
  "Pereira",
  "Lima",
  "Gomes",
  "Costa",
  "Ribeiro",
  "Martins",
  "Carvalho",
  "Almeida",
  "Lopes",
  "Soares",
  "Fernandes",
  "Vieira",
  "Barbosa",
];

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

  const clients = await Promise.all(
    Array.from({ length: 20 }).map((_, index) => {
      const firstName =
        RANDOM_FIRST_NAMES[
          Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)
        ];
      const lastName =
        RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)];
      const debitBalance =
        Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0;

      return prisma.client.create({
        data: {
          name: `${firstName} ${lastName}`,
          phone: `119${Math.floor(Math.random() * 100000000)}`,
          birthDate: new Date(
            1980 + Math.floor(Math.random() * 30),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          observations:
            Math.random() > 0.5 ? `Observação do cliente ${index + 1}` : null,
          storeId: store.id,
          debitBalance,
        },
      });
    })
  );

  const sales = await Promise.all(
    Array.from({ length: 20 }).map(async (_, index) => {
      const isPaid = Math.random() > 0.5;
      const value = Math.floor(Math.random() * 1000) + 100;
      const client = clients[Math.floor(Math.random() * clients.length)];
      const user = users[Math.floor(Math.random() * users.length)];

      const saleDate = new Date();
      saleDate.setMonth(saleDate.getMonth() - Math.floor(Math.random() * 3));
      saleDate.setDate(Math.floor(Math.random() * 28) + 1);

      const dueDate = new Date(saleDate);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 23) + 7);

      const sale = await prisma.sale.create({
        data: {
          value,
          description: `Venda ${index + 1} - Produto ${Math.floor(
            Math.random() * 100
          )}`,
          isPaid,
          saleDate,
          dueDate,
          storeId: store.id,
          clientId: client.id,
          userId: user.id,
        },
      });

      if (isPaid) {
        if (Math.random() < 0.7) {
          await prisma.payment.create({
            data: {
              value,
              payDate: new Date(
                saleDate.getTime() +
                  Math.random() * (new Date().getTime() - saleDate.getTime())
              ),
              saleId: sale.id,
            },
          });
        } else {
          const numberOfPayments = Math.floor(Math.random() * 2) + 2;
          let remainingValue = value;

          for (let i = 0; i < numberOfPayments; i++) {
            const isLastPayment = i === numberOfPayments - 1;
            const paymentValue = isLastPayment
              ? remainingValue
              : Math.floor(remainingValue / (numberOfPayments - i));

            await prisma.payment.create({
              data: {
                value: paymentValue,
                payDate: new Date(
                  saleDate.getTime() + i * 15 * 24 * 60 * 60 * 1000
                ),
                saleId: sale.id,
              },
            });

            remainingValue -= paymentValue;
          }
        }
      }

      return sale;
    })
  );

  console.log("Seed completed successfully!");
  console.log({
    store: { id: store.id, name: store.name },
    users: users.map((u) => ({ id: u.id, email: u.email })),
    clients: clients.map((c) => ({ id: c.id, name: c.name })),
    sales: sales.map((s) => ({ id: s.id, value: s.value, isPaid: s.isPaid })),
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
