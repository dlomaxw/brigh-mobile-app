
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

import { hashPassword } from './utils/auth';

const prisma = new PrismaClient();

const BASE_URL = 'http://localhost:5000'; // Make sure to run 'adb reverse tcp:5000 tcp:5000' for Android

// Helper to format title
function formatTitle(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper for random number
function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('Starting seed...');

    // Create Agent
    const agentEmail = 'agent@bproperties.com';
    let agent = await prisma.user.findUnique({ where: { email: agentEmail } });
    if (!agent) {
        const hashedPassword = await hashPassword('password123');
        agent = await prisma.user.create({
            data: {
                email: agentEmail,
                name: 'Agent Smith',
                password: hashedPassword,
                role: 'AGENT',
                phone: '+1 555 0199'
            }
        });
        console.log('Created Data Agent: agent@bproperties.com');
    }

    const propertiesDir = path.join(__dirname, '../public/images/properties');

    if (!fs.existsSync(propertiesDir)) {
        console.error('Properties directory not found:', propertiesDir);
        return;
    }

    const propertyFolders = fs.readdirSync(propertiesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    console.log(`Found ${propertyFolders.length} property folders.`);

    for (const folder of propertyFolders) {
        const title = formatTitle(folder);

        // Check if property exists
        const existing = await prisma.property.findFirst({ where: { title } });
        if (existing) {
            console.log(`Skipping existing property: ${title}`);
            continue;
        }

        const folderPath = path.join(propertiesDir, folder);
        const images = fs.readdirSync(folderPath)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        if (images.length === 0) {
            console.log(`No images found for ${title}, skipping.`);
            continue;
        }

        const price = randomInt(150000, 3000000);
        const bedrooms = randomInt(1, 6);
        const bathrooms = randomInt(1, bedrooms + 1);
        const type = ['HOUSE', 'APARTMENT', 'VILLA', 'CONDO'][randomInt(0, 3)];

        const property = await prisma.property.create({
            data: {
                title: title,
                description: `Beautiful ${title} located in a prime area. This ${bedrooms} bedroom, ${bathrooms} bathroom property provides excellent living space and modern amenities.`,
                price: price,
                type: type, // String in SQLite, mapped to Enum in Postgres if schema changed? 
                // Wait, I updated schema to 'postgresql' but didn't uncomment Enums. 
                // The current schema uses String for type.
                status: 'AVAILABLE',
                sizeSqm: randomInt(100, 600),
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                parking: randomInt(1, 3),
                city: 'Metropolis',
                area: 'Downtown',
                agentId: agent.id,
                media: {
                    create: images.map(img => ({
                        url: `${BASE_URL}/images/properties/${folder}/${img}`,
                        type: 'IMAGE'
                    }))
                }
            }
        });

        console.log(`Created property: ${title} with ${images.length} images`);
    }

    console.log('Seeding completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
