import { Search, Bell } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-900">Dashboard</span>
                <span className="mx-2">/</span>
                <span>Overview</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search workflows, logs..."
                        className="w-64 pl-9 pr-4 py-2 text-sm bg-gray-50 border-none rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                </div>

                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm"></div>
            </div>
        </header>
    );
}
