
import { PrismaClient } from '@prisma/client';
import { comparePassword } from './src/utils/auth';

const prisma = new PrismaClient();

async function main() {
    const email = 'agent@bproperties.com';
    const password = 'password123';

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User NOT found');
        return;
    }

    const isMatch = await comparePassword(password, user.password);
    console.log(`Checking password '${password}' against hash '${user.password}'`);
    console.log('Is Match:', isMatch);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
