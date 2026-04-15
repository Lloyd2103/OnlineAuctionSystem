import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
}
