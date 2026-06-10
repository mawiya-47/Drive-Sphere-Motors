export interface VehicleVariant {
  name: string;
  price: string; // e.g. "PKR 7,500,000"
  engine: string;
  transmission: string;
  fuelType: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: "Cars & MPVs" | "SUVs & Pickups" | "Buses & Vans";
  tagline: string;
  description: string;
  basePrice: string;
  variants: VehicleVariant[];
  image: string; // custom gradient/illustration representing the car
  colors: string[]; // hex codes for interactive vehicle viewer
  specs: {
    engineSize: string;
    power: string;
    efficiency: string; // e.g., "16 km/l"
    seating: string;
    drivetrain: string;
    safetyRating: string;
  };
  features: string[];
  isHybrid?: boolean;
  isGRSport?: boolean;
}

export interface Dealer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  coordinates: { lat: number; lng: number };
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  vehicleName: string;
  variantName: string;
  color: string;
  dealerId: string;
  status: "Pending" | "Confirmed" | "Documents Submitted" | "Ready for Delivery";
  paymentStatus: "Unpaid" | "Stripe Paid (Deposit)";
  amountPaid: string;
  date: string;
}

export interface ServiceAppointment {
  id: string;
  userId: string;
  vehicleRegNo: string;
  dealerId: string;
  serviceType: "Maintenance" | "Periodic" | "Body & Paint" | "Express Maintenance";
  preferredDate: string;
  preferredTime: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed";
  notes?: string;
}

export interface FinancingQuote {
  vehicleId: string;
  variantName: string;
  price: number;
  bank: string;
  tenureYears: number;
  downPaymentPercent: number;
  interestRate: number;
  monthlyEMI: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: "Corporate" | "Vehicle Launch" | "Safety" | "Sustainability" | "CSR";
  summary: string;
  content: string;
  date: string;
  image: string;
}

export interface PartsItem {
  id: string;
  name: string;
  partNo: string;
  category: "Engine" | "Brakes" | "Filters" | "Electrical" | "Accessories";
  price: number;
  description: string;
  compatibility: string;
  stock: number;
}
