// components/ProtectedRoute.tsx
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const auth = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!auth.token) {
            router.replace('/');
        }
    }, [auth.token, router]);


    return auth.token ? <>{children}</> : null;
};

export default ProtectedRoute;