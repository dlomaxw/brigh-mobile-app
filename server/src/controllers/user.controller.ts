import { Request, Response } from 'express';
import prisma from '../prisma';
import { hashPassword } from '../utils/auth';

export const getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                _count: {
                    select: {
                        properties: true,
                        leads: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, role, phone } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'AGENT',
                phone
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, email, role, phone, password } = req.body;

        const data: any = { name, email, role, phone };
        if (password) {
            data.password = await hashPassword(password);
        }

        const user = await prisma.user.update({
            where: { id },
            data
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

export const getPerformanceMetrics = async (req: Request, res: Response): Promise<any> => {
    try {
        // Mock metrics or aggregate real data
        const totalProperties = await prisma.property.count();
        const totalLeads = await prisma.lead.count();
        const totalAgents = await prisma.user.count({ where: { role: 'AGENT' } });

        // Detailed metrics per agent could be added here

        res.json({
            totalProperties,
            totalLeads,
            totalAgents
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error });
    }
};
