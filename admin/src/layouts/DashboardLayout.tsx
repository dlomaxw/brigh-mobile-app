import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 text-gray-700">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin<span className="text-blue-600">Panel</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavLink to="/properties" icon={<Building2 size={20} />} label="Properties" />
                    <NavLink to="/leads" icon={<Users size={20} />} label="Leads" />
                    <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">A</div>
                    </div>
                </header>
                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <Link to={to} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
            {icon}
            <span>{label}</span>
        </Link>
    )
}
