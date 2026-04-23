export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  type: string;
  image: string;
  features: string;
  excludedFeatures: string;
  badge?: string | null;
  icon: string;
  isFeatured: boolean;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  date: string;
  guests: number;
  totalPrice: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  addons: string;
  status: string;
  createdAt: string;
}
