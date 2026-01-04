import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Basic check. For better security, you might want to validate token expiry
    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    // Role check could be added here if needed
    // const user = JSON.parse(userStr);

    return <Outlet />;
}
