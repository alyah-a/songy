export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
}

// Available add-ons
export const ADDONS: Record<string, Addon> = {
  rush: {
    id: "rush",
    name: "3-Day Rush Delivery",
    description: "Priority turnaround in 3 days",
    priceInCents: 4900, // $49
  },
  video: {
    id: "video",
    name: "Video with Photos & Clips",
    description: "Sync your song with photos or videos you provide",
    priceInCents: 5900, // $59
  },
};

// All available products with their combinations
export const PRODUCTS: Product[] = [
  {
    id: "song-standard",
    name: "Custom Song",
    description: "Original song with custom lyrics, 7-day delivery, 1 revision included",
    priceInCents: 7900, // $79
  },
  {
    id: "song-rush",
    name: "Custom Song + Rush Delivery",
    description: "Original song with custom lyrics, 3-day delivery, 1 revision included",
    priceInCents: 12800, // $79 + $49
  },
  {
    id: "song-video",
    name: "Custom Song + Video",
    description: "Original song with custom lyrics, 7-day delivery, includes video with photos/clips",
    priceInCents: 13800, // $79 + $59
  },
  {
    id: "song-rush-video",
    name: "Custom Song + Rush + Video",
    description: "Original song with custom lyrics, 3-day delivery, includes video with photos/clips",
    priceInCents: 18700, // $79 + $49 + $59
  },
];

// Calculate total price based on selected addons
export function calculateTotal(selectedAddons: string[]): number {
  const basePrice = 7900;
  const addonTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS[addonId];
    return sum + (addon?.priceInCents ?? 0);
  }, 0);
  return basePrice + addonTotal;
}

// Get product by ID
export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}
