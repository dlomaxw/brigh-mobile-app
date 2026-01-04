import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Prisma initialized. DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');

export default prisma;
