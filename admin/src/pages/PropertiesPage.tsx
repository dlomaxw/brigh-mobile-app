import { useEffect, useState } from 'react';
import { Plus, Search, MapPin, Bed, Bath, Layout, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Property {
    id: string;
    title: string;
    price: string | number;
    city: string;
    status: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    sizeSqm: number;
    media?: { url: string; type: string }[];
}

export default function PropertiesPage() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await api.get('/properties');
            setProperties(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Properties</h1>
                <button
                    onClick={() => navigate('/properties/new')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors shadow-lg"
                >
                    + Add Property
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-gray-400 col-span-3 text-center py-20">Loading properties...</div>
                ) : properties.length === 0 ? (
                    <div className="text-gray-400 col-span-3 text-center py-20">No properties found.</div>
                ) : (
                    properties.map((property) => (
                        <div
                            key={property.id}
                            onClick={() => navigate(`/properties/${property.id}`)}
                            className="bg-neutral-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-yellow-400/50 transition-all cursor-pointer group flex flex-col h-full"
                        >
                            {/* Image Section */}
                            <div className="relative aspect-[4/3] bg-gray-900 group-hover:opacity-90 transition-opacity">
                                <span className="absolute top-4 left-4 z-10 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {property.status === 'AVAILABLE' ? 'Featured' : property.status}
                                </span>
                                {property.media && property.media.length > 0 ? (
                                    <img src={property.media[0].url} alt={property.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-600">
                                        <div className="text-center">
                                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                            <span className="text-sm">400 x 300</span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-4 right-4">
                                    <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10">
                                        {property.status === 'AVAILABLE' ? 'For Sale' : property.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-1 leading-tight">{property.title}</h3>
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                                    <MapPin size={14} />
                                    <span>{property.city}</span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-300 font-medium mb-4">
                                    {property.bedrooms > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <Bed size={14} className="text-gray-500" /> {property.bedrooms} Beds
                                        </div>
                                    )}
                                    {property.bathrooms > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <Bath size={14} className="text-gray-500" /> {property.bathrooms} Baths
                                        </div>
                                    )}
                                    {property.sizeSqm > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <Layout size={14} className="text-gray-500" /> {property.sizeSqm} Sqm
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div>
                                        <span className="block text-yellow-400 text-lg font-bold">
                                            ${Number(property.price).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
