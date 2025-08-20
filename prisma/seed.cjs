const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const email = "test@example.com";
    const password = "Passw0rd!";
    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
        where: { email },
        update: { hashedPassword: hashed },
        create: {
            email,
            name: "Test User",
            role: "VIEWER",
            hashedPassword: hashed
        }
    });

    console.log("Seeded user:", email, "password:", password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });