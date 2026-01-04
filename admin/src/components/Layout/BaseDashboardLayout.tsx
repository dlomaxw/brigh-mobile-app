import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

export default function BaseDashboardLayout() {
    return (
        <div className="flex h-screen bg-primary text-white overflow-hidden">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col h-full overflow-y-auto transition-all duration-300">
                {/* Header (Optional, if needed, but Sidebar acts as main nav now) */}
                {/* <Header /> */}

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
