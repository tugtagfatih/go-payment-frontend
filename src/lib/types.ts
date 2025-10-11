export interface Listing {
	id: string; // Go'daki uuid.UUID, JSON'da string'e dönüşür
	seller_id: string;
	item_name: string;
	description: string;
	price: number;
	status: string;
	created_at: string; // Go'daki time.Time, JSON'da string'e dönüşür
}