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

// Base song product
export const BASE_SONG: Product = {
  id: "base-song",
  name: "Custom Song",
  description: "Original song with custom lyrics, 7-day delivery, 1 revision included",
  priceInCents: 7900, // $79
};

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

// Calculate total price based on selected addons
export function calculateTotal(selectedAddons: string[]): number {
  const addonTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS[addonId];
    return sum + (addon?.priceInCents ?? 0);
  }, 0);
  return BASE_SONG.priceInCents + addonTotal;
}
