import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, MessageSquare, Search, Trash2 } from 'lucide-react';
import api from '../services/api';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    propertyId?: string;
    createdAt: string;
    property?: {
        id: string;
        title: string;
    };
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this lead?')) return;
        try {
            await api.delete(`/leads/${id}`);
            setLeads(leads.filter(l => l.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads & Inquiries</h1>
                    <p className="text-sm text-gray-500">Manage incoming messages from potential clients</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading leads...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No leads found.</div>
                    ) : (
                        filteredLeads.map((lead) => (
                            <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                                            {lead.name[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-blue-600">
                                                    <Mail size={14} /> {lead.email}
                                                </a>
                                                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-blue-600">
                                                    <Phone size={14} /> {lead.phone}
                                                </a>
                                            </div>

                                            {lead.property && (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 mb-3">
                                                    Interested in: <span className="text-blue-600">{lead.property.title}</span>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                                                <p className="text-sm">{lead.message}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleDelete(lead.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Lead"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
