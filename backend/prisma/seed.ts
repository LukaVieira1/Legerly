import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Emma",
  "Frank",
  "Grace",
  "Henry",
  "Isabel",
  "John",
  "Kate",
  "Lucas",
  "Maria",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Rachel",
  "Sam",
  "Thomas",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

const SALE_DESCRIPTIONS = [
  "Electronics Purchase",
  "Home Appliances",
  "Furniture Set",
  "Kitchen Equipment",
  "Office Supplies",
  "Sporting Goods",
  "Fashion Items",
  "Beauty Products",
  "Books and Stationery",
  "Tools and Hardware",
];

async function main() {
  // Create store
  const store = await prisma.store.create({
    data: {
      name: "Demo Store",
      image: "https://picsum.photos/200",
    },
  });

  // Create users with different roles
  const hashedPassword = await hash("123456", 8);

  const [owner, manager, employee] = await Promise.all([
    // Owner
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@demo.com",
        password: hashedPassword,
        stores: {
          create: {
            storeId: store.id,
            role: "OWNER",
          },
        },
      },
    }),
    // Manager
    prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane@demo.com",
        password: hashedPassword,
        stores: {
          create: {
            storeId: store.id,
            role: "MANAGER",
          },
        },
      },
    }),
    // Employee
    prisma.user.create({
      data: {
        name: "Bob Wilson",
        email: "bob@demo.com",
        password: hashedPassword,
        stores: {
          create: {
            storeId: store.id,
            role: "EMPLOYEE",
          },
        },
      },
    }),
  ]);

  const users = [owner, manager, employee];

  // Create 20 clients
  const clients = await Promise.all(
    Array.from({ length: 20 }).map((_) => {
      const firstName =
        FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName =
        LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

      return prisma.client.create({
        data: {
          name: `${firstName} ${lastName}`,
          phone: `119${Math.floor(Math.random() * 90000000 + 10000000)}`,
          birthDate: new Date(
            1970 + Math.floor(Math.random() * 40),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          observations:
            Math.random() > 0.5
              ? `Regular customer since ${2020 + Math.floor(Math.random() * 4)}`
              : null,
          storeId: store.id,
          debitBalance: 0, // Initialize with zero, will be updated after sales
        },
      });
    })
  );

  // Create 30 sales with random distribution among clients and users
  for (let i = 0; i < 30; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const saleValue = Math.floor(Math.random() * 900) + 100; // Random value between 100 and 1000
    const isPaid = Math.random() > 0.4; // 60% chance of being paid
    const paymentValue = isPaid
      ? saleValue
      : Math.floor(saleValue * Math.random());

    // Create sale with random past date (up to 3 months ago)
    const saleDate = new Date();
    saleDate.setMonth(saleDate.getMonth() - Math.floor(Math.random() * 3));
    saleDate.setDate(Math.floor(Math.random() * 28) + 1);

    const sale = await prisma.sale.create({
      data: {
        value: saleValue,
        description: `${
          SALE_DESCRIPTIONS[
            Math.floor(Math.random() * SALE_DESCRIPTIONS.length)
          ]
        } #${i + 1}`,
        isPaid,
        saleDate,
        dueDate: new Date(saleDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after sale
        storeId: store.id,
        clientId: client.id,
        userId: user.id,
      },
    });

    if (paymentValue > 0) {
      await prisma.payment.create({
        data: {
          value: paymentValue,
          payDate: new Date(
            saleDate.getTime() +
              Math.random() * (new Date().getTime() - saleDate.getTime())
          ),
          saleId: sale.id,
        },
      });
    }

    // Update client's debit balance
    const remainingValue = saleValue - paymentValue;
    if (remainingValue > 0) {
      await prisma.client.update({
        where: { id: client.id },
        data: {
          debitBalance: {
            increment: remainingValue,
          },
        },
      });
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
