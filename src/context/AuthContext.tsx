'use client'
// context/AuthContext.js
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '@/serivces/authService';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface User {
    id: string;
    role: string;
    email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }:{children:ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode<User>(token);
            setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        }
        if (!token) {
            logout();
        }
    }, []);

    const login = async (email: string, password: string) => {

        const res = await loginUser({ email, password });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            const decoded = jwtDecode<User>(data.token);
            setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
            router.push('/');
        } else {
            console.error(data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
