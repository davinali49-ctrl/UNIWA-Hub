import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/me`,
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                setUser(null);
                return null;
            }

            const result = await response.json();

            setUser(result.user);

            return result.user;

        } catch (error) {
            console.error('Gagal memeriksa login:', error);
            setUser(null);
            return null;

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    async function logout() {
        const response = await fetch(
            `${API_URL}/api/auth/logout`,
            {
                method: 'POST',
                credentials: 'include'
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Logout gagal');
        }

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                checkAuth,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
