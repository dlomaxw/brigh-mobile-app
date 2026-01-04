import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createProperty = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const {
            title, description, price, type, status,
            sizeSqm, bedrooms, bathrooms, parking, unitTypes,
            city, area, latitude, longitude,
            amenities, media
        } = req.body;

        const agentId = req.body.agentId || req.user.id; // Allow manual assignment or default to creator

        const property = await prisma.property.create({
            data: {
                title, description, price, type, status,
                sizeSqm, bedrooms, bathrooms, parking, unitTypes,
                city, area, latitude, longitude,
                agentId,
                amenities: amenities ? {
                    create: amenities.map((amenityId: string) => ({
                        amenity: { connect: { id: amenityId } }
                    }))
                } : undefined,
                media: media ? {
                    create: media.map((m: any) => ({
                        url: m.url,
                        type: m.type || 'IMAGE'
                    }))
                } : undefined
            },
        });

        res.status(201).json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating property', error });
    }
};

export const getProperties = async (req: Request, res: Response): Promise<any> => {
    try {
        const { search, type, minPrice, maxPrice } = req.query;

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: String(search) } }, // SQLite contains is case-sensitive usually, but Prisma might handle it
                { description: { contains: String(search) } },
                { city: { contains: String(search) } },
                { area: { contains: String(search) } }
            ];
        }

        if (type && type !== 'All') {
            where.type = String(type).toUpperCase();
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                media: true,
                amenities: { include: { amenity: true } }
            }
        });
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching properties', error });
    }
};

export const getPropertyById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                agent: { select: { id: true, name: true, email: true, phone: true } },
                media: true,
                amenities: { include: { amenity: true } }
            }
        });

        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property', error });
    }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        // Optionally check if user is owner or admin
        await prisma.property.delete({ where: { id } });
        res.json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error });
    }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const {
            title, description, price, type, status,
            sizeSqm, bedrooms, bathrooms, parking, unitTypes,
            city, area, latitude, longitude, agentId,
            media
        } = req.body;

        const updateData: any = {
            title, description, price, type, status,
            sizeSqm, bedrooms, bathrooms, parking, unitTypes,
            city, area, latitude, longitude,
            agentId // Include in update
        };

        if (media) {
            // First delete existing media
            await prisma.propertyMedia.deleteMany({ where: { propertyId: id } });
            // Then create new
            updateData.media = {
                create: media.map((m: any) => ({
                    url: m.url,
                    type: m.type || 'IMAGE'
                }))
            };
        }

        const property = await prisma.property.update({
            where: { id },
            data: updateData,
            include: { media: true }
        });

        res.json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property', error });
    }
};
