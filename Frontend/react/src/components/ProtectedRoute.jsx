import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Memeriksa autentikasi...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to={user.role === 'admin' ? '/admin' : '/mahasiswa'}
                replace
            />
        );
    }

    return children;
}