import { authStore } from './authStore';
import { get } from 'svelte/store';

const API_BASE_URL = 'https://8080-firebase-go-odeme-bildirimi-1759869459857.cluster-yy7ncoxb5zd4ouvntrhoc3go3k.cloudworkstations.dev';

// Bu fonksiyon, global fetch'i sarmalayarak her isteğe otomatik olarak Auth header'ı ekler.
export const apiFetch = async (path: string, options: RequestInit = {}) => {
	const { token } = get(authStore); // authStore'dan anlık token değerini al

	const defaultHeaders: HeadersInit = {
		'Content-Type': 'application/json'
	};

	// Eğer bir token'ımız varsa, Authorization başlığını ekle
	if (token) {
		defaultHeaders['Authorization'] = `Bearer ${token}`;
	}

	// Metot, body gibi diğer ayarları ve başlıkları birleştir
	const requestOptions: RequestInit = {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers
		}
	};

	// Tam URL'yi oluştur ve isteği gönder
	const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);

	return response;
};