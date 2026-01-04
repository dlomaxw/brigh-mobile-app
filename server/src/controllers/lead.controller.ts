import { Request, Response } from 'express';
import prisma from '../prisma';

export const createLead = async (req: Request, res: Response): Promise<any> => {
    try {
        const { propertyId, name, email, phone, message } = req.body;

        const lead = await prisma.lead.create({
            data: {
                propertyId,
                name,
                email,
                phone,
                message,
                status: 'NEW'
            }
        });

        res.status(201).json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating lead', error });
    }
};

export const getLeads = async (req: Request, res: Response): Promise<any> => {
    try {
        const leads = await prisma.lead.findMany({
            include: {
                property: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leads', error });
    }
};
