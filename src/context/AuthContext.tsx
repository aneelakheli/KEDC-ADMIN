'use client'
// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import { loginUser } from '@/serivces/authService';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface User {
    id: string;
    role: string;
    // other user properties...
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        }
    }, []);

    const login = async (email, password) => {

        const res = await loginUser({ email, password });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            const decoded = jwtDecode(data.token);
            setUser({ id: decoded.id, role: decoded.role });
            router.push('/dashboard/');
        } else {
            console.error(data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/dashboard/login');
    };

    return (
        <AuthContext.Provider value= {{ user, login, logout}}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
