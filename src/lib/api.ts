import { authStore } from './authStore';
import { get } from 'svelte/store';
import { API_BASE_URL } from './constants'; // API_BASE_URL'i constants'tan alın

// Fonksiyonu, özel bir fetch alacak şekilde güncelleyin
export const apiFetch = async (path: string, options: RequestInit = {}, customFetch: typeof fetch = fetch) => {
	const { token } = get(authStore);

	const defaultHeaders: HeadersInit = {
		'Content-Type': 'application/json'
	};

	if (token) {
		defaultHeaders['Authorization'] = `Bearer ${token}`;
	}

	const requestOptions: RequestInit = {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers
		}
	};

	// Global fetch yerine gelen customFetch'i kullanın
	const response = await customFetch(`${API_BASE_URL}${path}`, requestOptions);

	return response;
};