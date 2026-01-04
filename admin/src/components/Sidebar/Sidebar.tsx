import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, Search, LogOut } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 bg-secondary border-r border-tertiary hidden md:flex flex-col fixed inset-y-0 z-50">
            {/* Logo Area */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                        <span className="text-black">⚡</span>
                    </div>
                    <span className="text-xl font-bold text-gray-100">Admin Panel</span>
                </div>

                {/* Sidebar Search (can remove if mostly listing items, but keeping styled dark) */}
                {/* <div className="relative mb-6"> ... removed for cleaner look as per screenshot ... </div> */}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/'} />
                <NavLink to="/properties" icon={<FileText size={18} />} label="Properties" active={location.pathname.startsWith('/properties')} />
                <NavLink to="/projects" icon={<FileText size={18} />} label="Projects" active={location.pathname.startsWith('/projects')} /> {/* Placeholder */}
                <NavLink to="/leads" icon={<Users size={18} />} label="Inquiries" active={location.pathname.startsWith('/leads')} />
                <NavLink to="/users" icon={<Users size={18} />} label="Agents" active={location.pathname.startsWith('/users')} />
                <NavLink to="/settings" icon={<Settings size={18} />} label="Settings" active={location.pathname.startsWith('/settings')} />
            </nav>

            {/* User Profile / Bottom */}
            <div className="p-4 border-t border-tertiary">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white transition-colors">
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}

function NavLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden
                ${active
                    ? 'text-accent'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
        >
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />
            )}
            {icon}
            <span>{label}</span>
        </Link>
    )
}
