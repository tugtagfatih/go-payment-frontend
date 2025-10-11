import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode'; // YENİ IMPORT

// Store'umuz artık rol bilgisini de tutacak
const initialAuthState = {
    token: null as string | null,
    isAuthenticated: false,
    role: null as string | null // YENİ ALAN
};

// JWT'nin payload'unun neye benzediğini tanımlıyoruz
interface JwtPayload {
    sub: string;
    exp: number;
    role: string; // Backend'de token'a eklediğimiz rol alanı
}

if (browser) {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
        try {
            const decoded = jwtDecode<JwtPayload>(savedToken);
            initialAuthState.token = savedToken;
            initialAuthState.isAuthenticated = true;
            initialAuthState.role = decoded.role; // Rolü decode edip state'e ekliyoruz
        } catch (error) {
            // Eğer token bozuksa temizle
            localStorage.removeItem('jwt_token');
        }
    }
}

export const authStore = writable(initialAuthState);

export const login = (token: string) => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        localStorage.setItem('jwt_token', token);
        authStore.set({ token: token, isAuthenticated: true, role: decoded.role });
    } catch (error) {
        console.error("Invalid token:", error);
    }
};

export const logout = () => {
    localStorage.removeItem('jwt_token');
    authStore.set({ token: null, isAuthenticated: false, role: null });
};