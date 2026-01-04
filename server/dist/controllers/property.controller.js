"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, price, type, status, sizeSqm, bedrooms, bathrooms, parking, city, area, latitude, longitude, amenities } = req.body;
        const agentId = req.user.id; // From auth middleware
        const property = yield prisma_1.default.property.create({
            data: {
                title, description, price, type, status,
                sizeSqm, bedrooms, bathrooms, parking,
                city, area, latitude, longitude,
                agentId,
                amenities: amenities ? {
                    create: amenities.map((amenityId) => ({
                        amenity: { connect: { id: amenityId } }
                    }))
                } : undefined
            },
        });
        res.status(201).json(property);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating property', error });
    }
});
exports.createProperty = createProperty;
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simple implementation - could add filters later
        const properties = yield prisma_1.default.property.findMany({
            include: {
                media: true,
                amenities: { include: { amenity: true } }
            }
        });
        res.json(properties);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching properties', error });
    }
});
exports.getProperties = getProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const property = yield prisma_1.default.property.findUnique({
            where: { id },
            include: {
                agent: { select: { id: true, name: true, email: true, phone: true } },
                media: true,
                amenities: { include: { amenity: true } }
            }
        });
        if (!property)
            return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property', error });
    }
});
exports.getPropertyById = getPropertyById;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Optionally check if user is owner or admin
        yield prisma_1.default.property.delete({ where: { id } });
        res.json({ message: 'Property deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting property', error });
    }
});
exports.deleteProperty = deleteProperty;
