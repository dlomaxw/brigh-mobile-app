import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import api from '../services/api';

interface PropertyFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function PropertyForm({ initialData, isEdit = false }: PropertyFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        type: 'Apartment',
        status: 'AVAILABLE',
        city: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        sizeSqm: '',
        parking: '',
        sizeSqm: '',
        parking: '',
        unitTypes: '',
        agentId: '', // Added agentId
    });
    const [imageUrl, setImageUrl] = useState('');
    const [images, setImages] = useState<{ url: string, type: string }[]>([]);
    const [agents, setAgents] = useState<any[]>([]); // Data for dropdown

    useEffect(() => {
        // Fetch agents
        const fetchAgents = async () => {
            try {
                const res = await api.get('/users');
                // Filter for agents if needed, or just show all users
                setAgents(res.data.filter((u: any) => u.role === 'AGENT' || u.role === 'ADMIN'));
            } catch (err) {
                console.error('Error fetching agents', err);
            }
        };
        fetchAgents();

        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price || '',
                type: initialData.type || 'Apartment',
                status: initialData.status || 'AVAILABLE',
                city: initialData.city || '',
                area: initialData.area || '',
                bedrooms: initialData.bedrooms || '',
                bathrooms: initialData.bathrooms || '',
                sizeSqm: initialData.sizeSqm || '',
                parking: initialData.parking || '',
                parking: initialData.parking || '',
                unitTypes: initialData.unitTypes || '',
                agentId: initialData.agentId || '', // Pre-fill agentId
            });
            if (initialData.media) {
                setImages(initialData.media);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setImages([...images, { url: imageUrl.trim(), type: 'IMAGE' }]);
            setImageUrl('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: Number(formData.price),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            sizeSqm: Number(formData.sizeSqm),
            parking: Number(formData.parking),
            media: images
        };

        try {
            if (isEdit && initialData?.id) {
                await api.put(`/properties/${initialData.id}`, payload);
            } else {
                await api.post('/properties', payload);
            }
            navigate('/properties');
        } catch (error) {
            console.error(error);
            alert('Error saving property');
        } finally {
            setLoading(false);
        }
    };

    // Standardized Dark input styles with explicit colors
    const inputClass = "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder-gray-500";
    const labelClass = "text-sm font-medium text-gray-300 block mb-1.5";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/properties')} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl p-8 space-y-8">
                {/* Main Grid for Inputs */}
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div>
                                <label className={labelClass}>Title <span className="text-yellow-400">*</span></label>
                                <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="e.g. Luxury Apartment in Downtown" />
                            </div>

                            <div>
                                <label className={labelClass}>Description <span className="text-yellow-400">*</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass} placeholder="Describe the property..." />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Price ($) <span className="text-yellow-400">*</span></label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} required className={inputClass} placeholder="e.g. 250000" />
                        </div>

                        <div>
                            <label className={labelClass}>Location (City) <span className="text-yellow-400">*</span></label>
                            <input name="city" value={formData.city} onChange={handleChange} required className={inputClass} placeholder="e.g. New York" />
                        </div>

                        <div>
                            <label className={labelClass}>Property Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Villa">Villa</option>
                                <option value="Office">Office</option>
                                <option value="Land">Land</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                                <option value="AVAILABLE">Available (For Sale)</option>
                                <option value="SOLD">Sold</option>
                                <option value="RENTED">Rented</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Bedrooms</label>
                                <input name="bedrooms" placeholder="3" type="number" value={formData.bedrooms} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Bathrooms</label>
                                <input name="bathrooms" placeholder="2" type="number" value={formData.bathrooms} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Size (sqm)</label>
                                <input name="sizeSqm" placeholder="120" type="number" value={formData.sizeSqm} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Area</label>
                                <input name="area" placeholder="Brooklyn" value={formData.area} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Unit Types</label>
                            <input name="unitTypes" placeholder="e.g. 1BHK, 2BHK, 3BHK" value={formData.unitTypes} onChange={handleChange} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Assigned Agent</label>
                            <select name="agentId" value={formData.agentId} onChange={handleChange} className={inputClass}>
                                <option value="">Select an Agent</option>
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name} ({agent.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="border-t border-neutral-800 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Images</h3>
                    <div className="flex gap-4 mb-6">
                        <input
                            placeholder="Paste Image URL here..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className={inputClass}
                        />
                        <button type="button" onClick={handleAddImage} className="flex-shrink-0 flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium">
                            <Plus size={18} /> Add
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="col-span-full p-8 border-2 border-dashed border-neutral-800 rounded-xl text-center">
                                <p className="text-gray-500">No images added yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-neutral-800">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Property'}
                    </button>
                </div>
            </form>
        </div>
    );
}
