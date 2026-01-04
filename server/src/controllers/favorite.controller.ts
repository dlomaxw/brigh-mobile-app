import { Request, Response } from 'express';
import prisma from '../prisma';

export const toggleFavorite = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user.id;
        const { propertyId } = req.body;

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: {
                    userId_propertyId: {
                        userId,
                        propertyId
                    }
                }
            });
            return res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    propertyId
                }
            });
            return res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error toggling favorite', error });
    }
};

export const getFavorites = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user.id;
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                property: {
                    include: {
                        media: true
                    }
                }
            }
        });

        // Return just the properties
        const properties = favorites.map(f => f.property);
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
};
