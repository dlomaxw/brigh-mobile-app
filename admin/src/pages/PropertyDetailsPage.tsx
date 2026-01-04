import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Bed, Bath, Car, Maximize, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

interface Property {
    id: string;
    title: string;
    description: string;
    price: string | number;
    city: string;
    status: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    sizeSqm: number;
    media?: { url: string; type: string }[];
}

export default function PropertyDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await api.get(`/properties/${id}`);
                setProperty(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!property) return <div className="p-8 text-center text-red-500">Property not found</div>;

    const images = property.media && property.media.length > 0 ? property.media : [];

    const nextImage = () => {
        if (images.length > 0) {
            setActiveImage((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            setActiveImage((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/properties')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{property.title}</h1>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                            <MapPin size={14} />
                            {property.city}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/properties/${property.id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
                >
                    <Edit size={18} /> Edit Property
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Carousel / Images Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-800 group">
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[activeImage].url}
                                    alt={`View ${activeImage + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? 'bg-yellow-400 w-6' : 'bg-white/50'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                <ImageIcon size={48} className="mb-2 opacity-30" />
                                <p>No images available</p>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Sidebar */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-sm space-y-6">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Price</p>
                            <h2 className="text-3xl font-bold text-yellow-400">${Number(property.price).toLocaleString()}</h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-neutral-800 text-gray-300 border border-neutral-700`}>
                                {property.type}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${property.status === 'AVAILABLE' ? 'bg-green-900/30 text-green-400 border-green-900/50' :
                                property.status === 'SOLD' ? 'bg-neutral-800 text-gray-500 border-neutral-700' :
                                    'bg-yellow-900/30 text-yellow-400 border-yellow-900/50'
                                }`}>
                                {property.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-neutral-800 rounded-lg text-gray-400"><Bed size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500">Bedrooms</p>
                                    <p className="font-semibold text-gray-200">{property.bedrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-neutral-800 rounded-lg text-gray-400"><Bath size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500">Bathrooms</p>
                                    <p className="font-semibold text-gray-200">{property.bathrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-neutral-800 rounded-lg text-gray-400"><Car size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500">Parking</p>
                                    <p className="font-semibold text-gray-200">{property.parking}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-neutral-800 rounded-lg text-gray-400"><Maximize size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500">Size</p>
                                    <p className="font-semibold text-gray-200">{property.sizeSqm} m²</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-sm">
                        <h3 className="font-semibold text-white mb-4">Description</h3>
                        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {property.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
