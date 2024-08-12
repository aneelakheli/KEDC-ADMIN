// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
    // Example: Parse user role from cookies, headers, or tokens
    const authorizationHeader = req.headers.get('authorization');

    // Check if the Authorization header is present and starts with "Bearer "
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Extract the token from the Authorization header
    const token = authorizationHeader.split(' ')[1];

    
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Decode the token or fetch the user role
    const userRole = await fetchUserRole(token); // Implement this function based on your auth system

    const url = req.nextUrl.clone();

    // Define protected routes and roles
    const protectedRoutes = {
        '/admin': ['admin'],
        '/editor': ['admin', 'author'],
        '/user': ['admin', 'author', 'teacher'],
    };

    // Check if the requested route is protected and if the user has access
    for (const [route, roles] of Object.entries(protectedRoutes)) {
        if (url.pathname.startsWith(route) && !roles.includes(userRole)) {
            return NextResponse.redirect(new URL('/403', req.url)); // Redirect to a "Forbidden" page
        }
    }

    return NextResponse.next();
}

// Example function to fetch user role based on token
async function fetchUserRole(token) {
    // Decode the token or call an API to get the user role
    const response = await fetch('https://your-api.com/auth/role', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data.role;
}

export const config = {
    matcher: ['/admin/:path*', '/editor/:path*', '/user/:path*'], // Apply middleware to specific routes
};
