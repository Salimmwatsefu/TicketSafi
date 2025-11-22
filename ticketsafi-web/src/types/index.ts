export interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: string;
  available_qty: number;
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    logo_image: string | null;
}

export interface Event {
  id: string;
  title: string;
  date: string; 
  location: string;
  price: string; 
  imageUrl: string;
  category: 'Concert' | 'Nightlife' | 'Festival' | 'Theatre';
  isSellingFast?: boolean;
  description?: string;
  tiers?: TicketTier[];
  organizer_name?: string;
  store?: Store | null; 
}