import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode'; // YENİ IMPORT
import { goto } from '$app/navigation';

const initialAuthState = {
    token: null as string | null,
    isAuthenticated: false,
    role: null as string | null,
    username: null as string | null, // YENİ ALAN
    email: null as string | null      // YENİ ALAN
};

interface JwtPayload {
    sub: string;
    exp: number;
    role: string;
    username: string; // YENİ ALAN
    email: string;    // YENİ ALAN
}

if (browser) {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
        try {
            const decoded = jwtDecode<JwtPayload>(savedToken);
            initialAuthState.token = savedToken;
            initialAuthState.isAuthenticated = true;
            initialAuthState.role = decoded.role;
            initialAuthState.username = decoded.username; // YENİ ALAN
            initialAuthState.email = decoded.email;       // YENİ ALAN
        } catch (error) {
            localStorage.removeItem('jwt_token');
        }
    }
}

export const authStore = writable(initialAuthState);

export const login = (token: string) => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        localStorage.setItem('jwt_token', token);
        authStore.set({
            token: token,
            isAuthenticated: true,
            role: decoded.role,
            username: decoded.username, // YENİ ALAN
            email: decoded.email        // YENİ ALAN
        });
    } catch (error) {
        console.error("Invalid token:", error);
    }
};

export const logout = () => {
    localStorage.removeItem('jwt_token');
    authStore.set({
        token: null,
        isAuthenticated: false,
        role: null,
        username: null, // YENİ ALAN
        email: null     // YENİ ALAN
    });
    goto('/login');
};