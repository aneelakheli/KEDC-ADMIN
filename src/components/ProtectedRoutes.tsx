'use client'
// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (roles && !roles.includes(user.role)) {
      router.replace('/unauthorized');
    }
    console.log('Helo ==========================',user);
  }, [user, router, roles]);

  if (!user || (roles && !roles.includes(user.role))) {
    return <p>Loading...</p>;
  }

  return children;
};

export default ProtectedRoute;
