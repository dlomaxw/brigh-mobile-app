import { useEffect, useState } from 'react';
import { Building2, Users, TrendingUp, DollarSign, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface DashboardStats {
    totalProperties: number;
    activeLeads: number;
    totalViews: number;
}

export default function DashboardHome() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        totalProperties: 0,
        activeLeads: 0,
        totalViews: 1250, // Mock for now
    });
    const [recentProperties, setRecentProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Metrics
                const metricsRes = await api.get('/users/metrics');
                setStats({
                    totalProperties: metricsRes.data.totalProperties || 0,
                    activeLeads: metricsRes.data.totalLeads || 0,
                    totalViews: metricsRes.data.totalAgents || 0, // Using Agents count as Views temporarily or similar mapping
                });

                // Fetch Recent Properties
                const propsRes = await api.get('/properties');
                setRecentProperties(propsRes.data.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="text-gray-500 mt-1">Welcome back, Admin</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/properties/new')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        + Add Property
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Properties"
                    value={stats.totalProperties}
                    icon={<Building2 className="text-blue-600" size={24} />}
                    trend="+12%"
                    trendUp={true}
                    bg="bg-blue-50"
                />
                <StatsCard
                    title="Active Leads"
                    value={stats.activeLeads}
                    icon={<Users className="text-purple-600" size={24} />}
                    trend="+5"
                    trendUp={true}
                    bg="bg-purple-50"
                />
                <StatsCard
                    title="Total Agents"
                    value={stats.totalViews}
                    icon={<TrendingUp className="text-green-600" size={24} />}
                    trend="+18%"
                    trendUp={true}
                    bg="bg-green-50"
                />
                <StatsCard
                    title="Revenue (Est)"
                    value="$1.2M"
                    icon={<DollarSign className="text-amber-600" size={24} />}
                    trend="+8.2%"
                    trendUp={true}
                    bg="bg-amber-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Properties */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Properties</h3>
                        <button onClick={() => navigate('/properties')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : recentProperties.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No properties found.</div>
                        ) : (
                            recentProperties.map(property => (
                                <div key={property.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        {property.media && property.media[0] ? (
                                            <img src={property.media[0].url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Building2 size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{property.title}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                            <MapPin size={14} />
                                            <span className="truncate">{property.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${property.status === 'AVAILABLE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {property.status}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">${Number(property.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 group-hover:translate-x-1 transition-transform">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity / Leads */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Recent Leads</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {/* Mock Leads */}
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-medium text-gray-900">Inquiry #{1000 + i}</h4>
                                    <span className="text-xs text-gray-400">2h ago</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">Hi, I'm interested in the property at Downtown...</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">JD</div>
                                    <span className="text-xs text-gray-500">John Doe</span>
                                </div>
                            </div>
                        ))}
                        <div className="p-4 text-center">
                            <button onClick={() => navigate('/leads')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Leads</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend, trendUp, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center transition-transform hover:scale-110`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'} bg-opacity-10 px-2 py-1 rounded-full ${trendUp ? 'bg-green-50' : 'bg-red-50'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    )
}
