import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create a default agent
    // Create or get default agent
    const agent = await prisma.user.upsert({
        where: { email: 'agent@bproperties.com' },
        update: {},
        create: {
            email: 'agent@bproperties.com',
            name: 'Gerd Müller',
            password: 'password123',
            role: 'AGENT',
            phone: '+1 234 567 890'
        }
    });

    // Create properties matching the images
    const properties = [
        {
            title: "Springdale Heights",
            description: "Elegant new construction in sought-after Venetian Islands featuring 5BR/5.5BA, 3,120 SF, and design by Steven Sanchez.",
            price: 2700000,
            type: "VILLA",
            status: "AVAILABLE",
            sizeSqm: 3120 / 10.764, // Convert sqft to sqm approx
            bedrooms: 5,
            bathrooms: 5,
            parking: 2,
            city: "Springdale",
            area: "Heights",
            agentId: agent.id,
            media: {
                create: [
                    { url: "https://images.unsplash.com/photo-1600596542815-2a4d9f03229e?q=80&w=1000&auto=format&fit=crop", type: "IMAGE" },
                    { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop", type: "IMAGE" }
                ]
            }
        },
        {
            title: "Lakeside View",
            description: "Modern minimalist home with stunning lakeside views.",
            price: 2890000,
            type: "VILLA",
            status: "AVAILABLE",
            sizeSqm: 450,
            bedrooms: 4,
            bathrooms: 4,
            parking: 3,
            city: "Lakeside",
            area: "View",
            agentId: agent.id,
            media: {
                create: [
                    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop", type: "IMAGE" }
                ]
            }
        },
        {
            title: "Hilltop Terrace",
            description: "Contemporary design with infinity pool.",
            price: 2300000,
            type: "APARTMENT",
            status: "AVAILABLE",
            sizeSqm: 280,
            bedrooms: 3,
            bathrooms: 2,
            parking: 1,
            city: "Hilltop",
            area: "Terrace",
            agentId: agent.id,
            media: {
                create: [
                    { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1000&auto=format&fit=crop", type: "IMAGE" }
                ]
            }
        },
        {
            title: "Riverside Park",
            description: "Urban living at its finest.",
            price: 2400000,
            type: "APARTMENT",
            status: "AVAILABLE",
            sizeSqm: 300,
            bedrooms: 3,
            bathrooms: 3,
            parking: 1,
            city: "Riverside",
            area: "Park",
            agentId: agent.id,
            media: {
                create: [
                    { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop", type: "IMAGE" }
                ]
            }
        }
    ];

    for (const prop of properties) {
        await prisma.property.create({ data: prop });
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
