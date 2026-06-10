import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize GoogleGenAI SDK safely
const aiKey = process.env.GEMINI_API_KEY;
let ai: any = null;
if (aiKey && aiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully on server-side.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("No GEMINI_API_KEY provided or it's placeholder. AI features will run with beautiful rule-based fallback responses.");
}

// ----------------------------------------------------
// DATABASE (In-Memory CMS Engine & Store Data)
// ----------------------------------------------------

const VEHICLES = [
  {
    id: "corolla-cross",
    name: "Corolla Cross Hybrid",
    category: "SUVs & Pickups",
    tagline: "The Hybrid Shift for Modern Pakistan",
    description: "Pakistan's first locally assembled self-charging Hybrid SUV. Seamlessly power-packed, environment-friendly, and representing a legacy of ultimate comfort, advanced Toyota Safety Sense, and absolute luxury.",
    basePrice: "PKR 11,850,000",
    isHybrid: true,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800",
    colors: ["#1F2937", "#F9FAFB", "#7F8C8D", "#1A5F3A"],
    variants: [
      { name: "Corolla Cross Hybrid 1.8L HEV (Low Profile)", price: "PKR 11,850,000", engine: "1798 cc Dual VVT-i Hybrid", transmission: "e-CVT", fuelType: "Hybrid" },
      { name: "Corolla Cross Hybrid 1.8L HEV (Mid Speed)", price: "PKR 12,450,000", engine: "1798 cc Dual VVT-i Hybrid", transmission: "e-CVT", fuelType: "Hybrid" },
      { name: "Corolla Cross Hybrid 1.8L HEV GR Sport", price: "PKR 13,350,000", engine: "1798 cc Dual VVT-i High-Output Hybrid", transmission: "e-CVT with Sport Tuned Modes", fuelType: "Hybrid" }
    ],
    specs: {
      engineSize: "1798 cc",
      power: "122 HP combined",
      efficiency: "24.5 km/l",
      seating: "5 Persons",
      drivetrain: "Front-Wheel Drive",
      safetyRating: "5-Star Euro NCAP Equivalency"
    },
    features: ["Toyota Safety Sense 3.0", "7-inch Intelligent MID", "Dual Zone Auto AC", "Bi-Beam LED Headlamps", "Power Tailgate with Kick Sensor", "EV/Eco/Sport Modes"],
    isGRSport: true
  },
  {
    id: "yaris",
    name: "Yaris",
    category: "Cars & MPVs",
    tagline: "Value, Reliability & Modern Elegance",
    description: "Crafted for comfort and efficiency, the Yaris is the ideal sedan for standard urban commutes and highway speeds across Pakistan. Features incredible fuel efficiency, modern tech, and superb styling.",
    basePrice: "PKR 4,499,000",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800",
    colors: ["#F9FAFB", "#7F8C8D", "#111827"],
    variants: [
      { name: "Yaris 1.3L GLi MT", price: "PKR 4,499,000", engine: "1329 cc Dual VVT-i", transmission: "5-Speed Manual", fuelType: "Petrol" },
      { name: "Yaris 1.3L ATIV CVT", price: "PKR 4,899,000", engine: "1329 cc Dual VVT-i", transmission: "7-Speed Sport Sequential CVT", fuelType: "Petrol" },
      { name: "Yaris 1.5L ATIV X CVT (Aero Style)", price: "PKR 5,499,000", engine: "1496 cc High-Efficiency Dual VVT-i", transmission: "7-Speed Sport CVT", fuelType: "Petrol" }
    ],
    specs: {
      engineSize: "1329 cc - 1496 cc",
      power: "98 - 106 HP",
      efficiency: "16.8 km/l",
      seating: "5 Persons",
      drivetrain: "FWD",
      safetyRating: "Dual SRS Airbags & VSC Standard"
    },
    features: ["Smart Entry & Push Start", "9-inch Dynamic Floating Display", "Aero Sports Body Kit Option", "Eco Saving Mode Indicator", "Hill Start Assist Control"]
  },
  {
    id: "hilux-revo",
    name: "Hilux Revo GR-S",
    category: "SUVs & Pickups",
    tagline: "Unbreakable & Unmatched Off-Road Dominance",
    description: "The premium Toyota Hilux Revo Gazoo Racing Sport combines track-inspired engineering with the legendary durability of Hilux. Built for those who demand ultimate offroad performance and luxury.",
    basePrice: "PKR 14,399,000",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    colors: ["#C0392B", "#111827", "#F9FAFB"],
    variants: [
      { name: "Hilux Revo V Automatic 2.8L", price: "PKR 14,399,000", engine: "2755 cc Diesel Turbocharged Dynamic", transmission: "6-Speed Sequential Sport Auto", fuelType: "Diesel" },
      { name: "Hilux Revo Rocco 2.8L", price: "PKR 15,199,000", engine: "2755 cc Turbo Diesel Rocco Edition", transmission: "6-Speed Sport Auto", fuelType: "Diesel" },
      { name: "Hilux Revo GR SPORT (AWD Elite)", price: "PKR 16,149,000", engine: "2755 cc High Output Boost Diesel", transmission: "Paddle Shift 6-Speed Tuned Auto", fuelType: "Diesel" }
    ],
    specs: {
      engineSize: "2755 cc",
      power: "201 HP @ 3400 RPM",
      efficiency: "11.2 km/l",
      seating: "5 Persons Dual Cab",
      drivetrain: "4x4 with Dynamic Rear Diff Lock",
      safetyRating: "Full TSS & Active Traction Assist"
    },
    features: ["GR Sport Suspension Tuning", "Suede & Leather Sports Seats", "18\" Gloss Black GR Alloy Wheels", "Dual Zone Automatic Air Conditioning", "Downhill Assist Control (DAC)"],
    isGRSport: true
  },
  {
    id: "fortuner",
    name: "Fortuner Legender",
    category: "SUVs & Pickups",
    tagline: "The Prestige of Modern Sophistication",
    description: "Drive your ambition. Toyota Fortuner is the ultimate premium SUV in Pakistan, leading with standard 3-row leather seating, muscular offroad stance, massive power, and state of art intelligent safety upgrades.",
    basePrice: "PKR 18,999,000",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    colors: ["#F9FAFB", "#111827", "#7F8C8D"],
    variants: [
      { name: "Fortuner 2.7L G Petrol", price: "PKR 18,999,000", engine: "2694 cc Dual VVT-i", transmission: "6-Speed automatic", fuelType: "Petrol" },
      { name: "Fortuner 2.8L Sigma 4 Diesel (4x4)", price: "PKR 19,899,000", engine: "2755 cc Diesel Turbocharged", transmission: "6-Speed Auto AWD", fuelType: "Diesel" },
      { name: "Fortuner Legender Premium 4x4", price: "PKR 21,399,000", engine: "2755 cc Enhanced Turbo Diesel", transmission: "6-Speed Dynamic Auto", fuelType: "Diesel" }
    ],
    specs: {
      engineSize: "2694 cc - 2755 cc",
      power: "164 - 201 HP",
      efficiency: "10.5 km/l",
      seating: "7 Persons (3 rows)",
      drivetrain: "Dual Range 4x4 Selector",
      safetyRating: "5-Star Global Robust SUV Architecture"
    },
    features: ["Legender Front Grille with Ambient DRLs", "Power Tailgate with Touch-free Kick operation", "18-inch High-Sheen Alloys", "Sequential Rear Turn Signals", "Intelligent Cruise Control"]
  },
  {
    id: "corolla-x",
    name: "Corolla X",
    category: "Cars & MPVs",
    tagline: "The Unrivaled King of Pakistani Roads",
    description: "The legendary Corolla X is the defining standard of reliability, resilience, and executive dignity in Pakistan. With dynamic styling and incredible ride quality, it continues its reign on national avenues.",
    basePrice: "PKR 5,969,000",
    image: "https://images.unsplash.com/photo-1623859684198-586024a5633a?auto=format&fit=crop&q=80&w=800",
    colors: ["#F9FAFB", "#7F8C8D", "#111827", "#D4AF37"],
    variants: [
      { name: "Corolla Altis 1.6L X MT", price: "PKR 5,969,000", engine: "1598 cc Dual VVT-i", transmission: "5-Speed MT", fuelType: "Petrol" },
      { name: "Corolla Altis 1.6L X CVT-i", price: "PKR 6,499,000", engine: "1598 cc Dual VVT-i", transmission: "7-Speed Sequential CVT", fuelType: "Petrol" },
      { name: "Corolla Altis Grande 1.8L X CVT-i (Beige)", price: "PKR 7,549,000", engine: "1798 cc Dual VVT-i Dynamic", transmission: "Super ECT e-CVT with Paddles", fuelType: "Petrol" }
    ],
    specs: {
      engineSize: "1598 cc - 1798 cc",
      power: "120 - 138 HP",
      efficiency: "14.2 km/l",
      seating: "5 Persons",
      drivetrain: "FWD",
      safetyRating: "Dual SRS airbags & Crash Sensors Standard"
    },
    features: ["Sunroof & Keyless Smart Entry", "Altis X Premium Body Kit", "Electronic Cruise Control", "Infotainment with Mobile Screen Mirroring", "Grande Vehicle Stability Control"]
  },
  {
    id: "camry-hybrid",
    name: "Camry Luxury Hybrid",
    category: "Cars & MPVs",
    tagline: "Exquisite Prestige. Seamless power.",
    description: "Uncompromised status and visionary hybrid tech. The Camry Hybrid merges executive elegance with highly optimized 2.5L engine power and eco-conscious hybrid performance for Pakistan's elite.",
    basePrice: "PKR 29,999,000",
    isHybrid: true,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800",
    colors: ["#111827", "#F9FAFB", "#7F8C8D"],
    variants: [
      { name: "Camry Hybrid 2.5L Executive Dynamic", price: "PKR 29,999,000", engine: "2487 cc Hybrid High Output", transmission: "CVT Continuously Variable", fuelType: "Hybrid" }
    ],
    specs: {
      engineSize: "2487 cc",
      power: "215 HP",
      efficiency: "22.0 km/l",
      seating: "5 Persons Luxury",
      drivetrain: "FWD",
      safetyRating: "Premium TSS 3D Safety Shield"
    },
    features: ["Panoramic Class-1 Sunroof", "Premium 9-Speaker Audio", "3-Zone Climate Control Dynamic AC", "Full Leather Power Reclining Seats", "Heads-Up HUD Projection display"]
  },
  {
    id: "hiace-deluxe",
    name: "Hiace Deluxe",
    category: "Buses & Vans",
    tagline: "High-Capacity Executive Transport",
    description: "The benchmark for safe, executive, and high capacity group commutes. Features semi-hooded styling, ergonomic seating presets, exceptional suspension and absolute security for corporate taskforces.",
    basePrice: "PKR 12,999,000",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=800",
    colors: ["#F9FAFB", "#7F8C8D"],
    variants: [
      { name: "Hiace Standard Commuter 2.8L", price: "PKR 12,999,000", engine: "2755 cc High Torque Diesel", transmission: "5-Speed MT", fuelType: "Diesel" },
      { name: "Hiace Deluxe High-Roof Luxury (14-Seater)", price: "PKR 15,299,000", engine: "2755 cc High Torque Diesel", transmission: "6-Speed Auto Sporty", fuelType: "Diesel" }
    ],
    specs: {
      engineSize: "2755 cc",
      power: "154 HP",
      efficiency: "12.0 km/l",
      seating: "14-17 Seats Configurable",
      drivetrain: "Rear Wheel Drive",
      safetyRating: "Strong Reinforced Cabin Framework"
    },
    features: ["Ergonomic high-back recliner seats", "Triple rear AC vents distribution", "Sliding cabin doors", "Vehicle stability control standard"]
  },
  {
    id: "land-cruiser-300",
    name: "Land Cruiser 300 ZX",
    category: "SUVs & Pickups",
    tagline: "The Pinnacle of Luxury Offroad Sovereign",
    description: "Built upon 70 years of legendary rough road supremacy. Powered by newly formulated Twin-Turbo engines, dynamic luxury suspension presets, high fidelity digital sound, and unchallenged luxury presence.",
    basePrice: "PKR 115,000,000",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800",
    colors: ["#111827", "#F9FAFB", "#7F8C8D"],
    variants: [
      { name: "Land Cruiser 300 ZX Twin-Turbo 3.5L", price: "PKR 115,000,000", engine: "3445 cc V6 Twin-Turbo", transmission: "10-Speed automatic with Sport Shift", fuelType: "Petrol" }
    ],
    specs: {
      engineSize: "3445 cc",
      power: "409 HP @ 5200 RPM",
      efficiency: "8.5 km/l",
      seating: "7 Persons Sovereign Executive",
      drivetrain: "Full-Time 4WD with Multi-Terrain Select",
      safetyRating: "Toyota Safety Sense VIP Edition"
    },
    features: ["Multi-Terrain Monitor with 3D Underfloor perspective", "Rear Seat Entertainment Dual 11.6\" Displays", "Suede & Premium Walnut luxury interior trimming", "Dynamic Electronic Kinetic Suspension System (E-KDSS)", "Ventilated & Heated seats for front and 2nd Rows"]
  }
];

const DEALERS = [
  { id: "cm-karachi", name: "DriveSphere Central Motors Karachi", city: "Karachi", address: "Main Shahrah-e-Faisal, Near Nursery Flyover, PECHS, Karachi", phone: "+92 21 111 86 86 86", email: "info@dscentral.com.pk", coordinates: { lat: 24.8607, lng: 67.0011 } },
  { id: "wm-karachi", name: "DriveSphere Western Motors Karachi", city: "Karachi", address: "Main Sunset Boulevard, Phase 2, DHA, Karachi", phone: "+92 21 35891234", email: "sales@dswestern.com.pk", coordinates: { lat: 24.8219, lng: 67.0624 } },
  { id: "em-karachi", name: "DriveSphere Eastern Motors Karachi", city: "Karachi", address: "Plot 12, Korangi Industrial Area Road, Karachi", phone: "+92 21 4455889", email: "info@dseastern.com.pk", coordinates: { lat: 24.8427, lng: 67.1245 } },
  { id: "sm-lahore", name: "DriveSphere Township Motors Lahore", city: "Lahore", address: "Main Pekhewal Road, Near Township Market, Lahore", phone: "+92 42 111 500 600", email: "contact@dstownship.com.pk", coordinates: { lat: 31.5204, lng: 74.3587 } },
  { id: "gm-lahore", name: "DriveSphere Garden Motors Lahore", city: "Lahore", address: "Sher Shah Block, New Garden Town, Lahore", phone: "+92 42 35850942", email: "sales@dsgarden.com.pk", coordinates: { lat: 31.4984, lng: 74.3218 } },
  { id: "im-islamabad", name: "DriveSphere Islamabad Motors", city: "Islamabad", address: "Plot 42, Sector I-9, Industrial Area, Islamabad", phone: "+92 51 111 999 000", email: "info@dsislamabad.com.pk", coordinates: { lat: 33.6844, lng: 73.0479 } },
  { id: "rm-rawalpindi", name: "DriveSphere Rawal Motors Rawalpindi", city: "Rawalpindi", address: "Main Peshawar Road, Westridge, Rawalpindi", phone: "+92 51 5472301", email: "info@dsrawal.com.pk", coordinates: { lat: 33.5984, lng: 73.0441 } },
  { id: "fm-peshawar", name: "DriveSphere Frontier Motors Peshawar", city: "Peshawar", address: "Main University Road, Near Jamrud Crossing, Peshawar", phone: "+92 91 111 222 333", email: "sales@dsfrontier.com.pk", coordinates: { lat: 33.9974, lng: 71.4883 } },
  { id: "zm-quetta", name: "DriveSphere Zarghoon Motors Quetta", city: "Quetta", address: "Zarghoon Road, Opp GPO, Quetta", phone: "+92 81 2824012", email: "info@dszarghoon.com.pk", coordinates: { lat: 30.1798, lng: 66.9750 } }
];

const GENUINE_PARTS = [
  { id: "p1", name: "Synthetic Motor Engine Oil (5W-30 SN/GF-5)", partNo: "08880-84355", category: "Engine", price: 7850, description: "Toyota premium multi-grade high efficiency motor lubricating oil tested for state of art VVT-i engines.", compatibility: "Corolla Altis Grande, Corolla Cross HEV, Yaris ATIV", stock: 120 },
  { id: "p2", name: "Premium Air Filter Core", partNo: "17801-0M020", category: "Filters", price: 3400, description: "Catches microscopic dust particles keeping the air cylinder perfectly pristine, increasing standard engine performance.", compatibility: "Yaris, Corolla Altis Grande", stock: 85 },
  { id: "p3", name: "Premium HEV Cabin Air Purifying Screen", partNo: "87139-58010", category: "Filters", price: 4200, description: "Active carbon air filter absorbing harmful roadside exhaust fumes and regional pollen molecules.", compatibility: "Corolla Cross Hybrid, Camry HEV", stock: 64 },
  { id: "p4", name: "Front Heavy Brake Pad Set", partNo: "04465-0K140", category: "Brakes", price: 16500, description: "High coefficient premium composite material delivering supreme high-speed safety deceleration rates.", compatibility: "Hilux Revo, Fortuner", stock: 40 },
  { id: "p5", name: "Premium Spark Plug (Iridium Core Tough)", partNo: "90919-01253", category: "Electrical", price: 2900, description: "Long-living spark core igniting fuel mixture with high thermal efficiency and precision.", compatibility: "Corolla Altis, Yaris ATIV X", stock: 150 }
];

const NEWS_ARTICLES = [
  {
    id: "news-corolla-cross",
    title: "Eco-Shift: Corolla Cross Hybrid Sets New Localization Records in Pakistan",
    category: "Vehicle Launch",
    summary: "Standard setting green technology emerges as local assembly delivers high-efficiency hybrid cars reducing import dependence.",
    content: "Islamabad, June 2026. Indus Motor Company marks a legendary development milestone. The local integration of Corolla Cross HEV engines has crossed the 80% assembly localization target, guaranteeing high-tech, cheaper vehicles for Pakistani drivers. The country's transport policies continue rewarding eco-friendly hybrid investments to lower general national carbon footprints.",
    date: "2026-06-01",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "news-forest-csr",
    title: "Indus Eco-Forest Initiative Plan: Expanding Pakistan's Green Canopy",
    category: "CSR",
    summary: "Plantation of 500,000 native mangrove trees along Coastal Sindh to optimize ocean water retention rates and bio-richness.",
    content: "Karachi, May 2026. In keeping with modern industrial ESG commitments, DriveSphere Motors and Indus Partners proudly launch Phase 3 of our native Mangrove eco-forest program. A team of local residents and corporate volunteers planted 150,000 new units, shielding coastal communities and capturing deep atmospheric pollutants.",
    date: "2026-05-18",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "news-tss-safety",
    title: "DriveSphere Launches Nationwide 5S Safe Drive Campaign on Highways",
    category: "Safety",
    summary: "Road safety educational programs equipping inter-city transporters and students on responsive speed-brake operations.",
    content: "Lahore, April 2026. DriveSphere Motors initiated its landmark 'Safe Drive, Secure Home' nationwide caravan, delivering active feedback simulator setups in educational campuses and commercial transport cargo hubs across main avenues. Motorists received valuable manuals on modern braking techniques.",
    date: "2026-04-10",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"
  }
];

const SUSTAINABILITY_PROJECTS = [
  { id: "csr-1", title: "Indus Eco-Forest Delta Canopy", metric: "500K Mangroves Planted", status: "Active Conservation Phase" },
  { id: "csr-2", title: "Toyota-Indus Technical Training Academy", metric: "2,400+ Underprivileged Grads Employed", status: "Perpetual Academic Program" },
  { id: "csr-3", title: "Clean Water Safe Villages (Tarbela Outflow)", metric: "12 Water Filtration Stations Active", status: "Continuous Maintenance" },
  { id: "csr-4", title: "Highway First-Responder Kits Distribution", metric: "5,000 Emergency Safety Bundles", status: "Annual Campaign" }
];

// USER BOOKINGS & TEST DRIVES STORE (Pre-filled with 3 interactive samples for robust dashboards)
let BOOKINGS = [
  {
    id: "BK-1001",
    userId: "user-1",
    userName: "Ahmed Khan",
    userEmail: "starpanther0@gmail.com",
    vehicleName: "Corolla Cross Hybrid",
    variantName: "Corolla Cross Hybrid 1.8L HEV GR Sport",
    color: "Imperial Solid Emerald (#1A5F3A)",
    dealerId: "cm-karachi",
    status: "Confirmed",
    paymentStatus: "Stripe Paid (Deposit)",
    amountPaid: "PKR 500,000",
    date: "2026-06-07"
  },
  {
    id: "BK-1002",
    userId: "user-1",
    userName: "Ahmed Khan",
    userEmail: "starpanther0@gmail.com",
    vehicleName: "Yaris",
    variantName: "Yaris 1.5L ATIV X CVT (Aero Style)",
    color: "Premium High Gloss Silver (#7F8C8D)",
    dealerId: "sm-lahore",
    status: "Documents Submitted",
    paymentStatus: "Unpaid",
    amountPaid: "PKR 0",
    date: "2026-06-08"
  }
];

let APPOINTMENTS = [
  {
    id: "AP-2001",
    userId: "user-1",
    vehicleRegNo: "BKL-202X",
    dealerId: "sm-lahore",
    serviceType: "Periodic Maintenance",
    preferredDate: "2026-06-12",
    preferredTime: "11:00 AM",
    status: "Scheduled",
    notes: "Please carry out 10,000 KM general lubricant overhaul and brake pad inspections."
  },
  {
    id: "AP-2002",
    userId: "user-1",
    vehicleRegNo: "N/A (Test Drive)",
    dealerId: "wm-karachi",
    serviceType: "Express Maintenance",
    preferredDate: "2026-06-16",
    preferredTime: "03:30 PM",
    status: "Pending",
    notes: "Would like to test drive Corolla Cross GR-S on highway speed settings."
  }
];

// Lead inquiries
let USER_MESSAGES = [
  { id: "msg-1", name: "Ayesha Malik", email: "ayesha@demo.pk", query: "Interested in corporate leasing for Yaris 1.3L. Do you have multi-car packages?", date: "2026-06-08" }
];

// Audit trail
let AUDIT_LOGS = [
  { id: "log-1", user: "starpanther0@gmail.com", action: "Created Account", timestamp: "2026-06-08 06:10 AM" },
  { id: "log-2", user: "Ahmed Khan", action: "Paid Deposit Booking BK-1001 via credit/debit demo", timestamp: "2026-06-08 06:15 AM" }
];

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Auth Simulator
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  // Dynamic simplified demo login
  if (email && email.includes("@")) {
    const role = email.includes("admin") ? "Admin" : email.includes("dealer") ? "Dealer" : "Customer";
    const name = email.split("@")[0].toUpperCase();
    return res.json({
      success: true,
      user: {
        id: "user-1",
        name: name,
        email: email,
        role: role
      }
    });
  }
  res.status(400).json({ success: false, message: "Please enter a valid email." });
});

// Retrieve Catalogue
app.get("/api/vehicles", (req, res) => {
  res.json(VEHICLES);
});

// Retrieve Dealers
app.get("/api/dealers", (req, res) => {
  const { city } = req.query;
  if (city) {
    const filtered = DEALERS.filter(d => d.city.toLowerCase() === (city as string).toLowerCase());
    return res.json(filtered);
  }
  res.json(DEALERS);
});

// Bookings
app.get("/api/bookings", (req, res) => {
  res.json(BOOKINGS);
});

app.post("/api/bookings", (req, res) => {
  const { vehicleId, variantName, color, dealerId, userEmail, userName } = req.body;
  if (!vehicleId || !variantName || !dealerId) {
    return res.status(400).json({ success: false, message: "Missing required details for booking." });
  }

  const selectedVehicle = VEHICLES.find(v => v.id === vehicleId);
  const newBooking = {
    id: "BK-" + Math.floor(1000 + Math.random() * 9000),
    userId: "user-1",
    userName: userName || " আহমেদ Khan",
    userEmail: userEmail || "starpanther0@gmail.com",
    vehicleName: selectedVehicle ? selectedVehicle.name : vehicleId,
    variantName,
    color: color || "Signature Silver (#7F8C8D)",
    dealerId,
    status: "Pending" as const,
    paymentStatus: req.body.payNow ? ("Stripe Paid (Deposit)" as const) : ("Unpaid" as const),
    amountPaid: req.body.payNow ? "PKR 500,000" : "PKR 0",
    date: new Date().toISOString().split("T")[0]
  };

  BOOKINGS.unshift(newBooking);
  AUDIT_LOGS.unshift({
    id: "log-" + Date.now(),
    user: userEmail || "Customer Portal",
    action: `Created booking ${newBooking.id} for vehicle: ${newBooking.vehicleName}`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, booking: newBooking });
});

// Service appointments
app.get("/api/appointments", (req, res) => {
  res.json(APPOINTMENTS);
});

app.post("/api/appointments", (req, res) => {
  const { vehicleRegNo, dealerId, serviceType, preferredDate, preferredTime, notes } = req.body;
  if (!vehicleRegNo || !dealerId || !preferredDate || !preferredTime) {
    return res.status(400).json({ success: false, message: "Missing appointment slot dates or dealership info." });
  }

  const newAppointment = {
    id: "AP-" + Math.floor(2000 + Math.random() * 8000),
    userId: "user-1",
    vehicleRegNo,
    dealerId,
    serviceType: serviceType || "Periodic Maintenance",
    preferredDate,
    preferredTime,
    status: "Scheduled" as const,
    notes: notes || "General Periodic Service inspection."
  };

  APPOINTMENTS.unshift(newAppointment);
  AUDIT_LOGS.unshift({
    id: "log-" + Date.now(),
    user: "Ahmed Khan",
    action: `Scheduled vehicle service appointment ${newAppointment.id}`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, appointment: newAppointment });
});

// Update booking status (Admin / Dealer CRM tools)
app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const booking = BOOKINGS.find(b => b.id === id);
  if (booking) {
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    AUDIT_LOGS.unshift({
      id: "log-" + Date.now(),
      user: "Admin/Dealer Portal",
      action: `Modified status of Booking ${id} to [Status: ${booking.status}, Ref: ${booking.paymentStatus}]`,
      timestamp: new Date().toLocaleString()
    });
    return res.json({ success: true, booking });
  }
  res.status(404).json({ success: false, message: "Booking record not found" });
});

// Spare parts
app.get("/api/parts", (req, res) => {
  res.json(GENUINE_PARTS);
});

// Sustainability data
app.get("/api/sustainability", (req, res) => {
  res.json(SUSTAINABILITY_PROJECTS);
});

// CSR Campaigns & News Feed
app.get("/api/news", (req, res) => {
  res.json(NEWS_ARTICLES);
});

// Audit analytics
app.get("/api/admin/logs", (req, res) => {
  res.json(AUDIT_LOGS);
});

// ----------------------------------------------------
// AI GENIUSES: ASSISTANT & RECOMMENDER
// ----------------------------------------------------

// 1. AI Recommendation Engine
app.post("/api/ai/recommend", async (req, res) => {
  const { budget, primaryUse, fuelPref, driveRange } = req.body;

  let prompt = `You are a world-class premium luxury vehicle recommendation wizard at DriveSphere Motors (Pakistan's futuristic automotive hub inspired by Toyota Indus).
Here is the client profile seeking our recommendations:
- High Budget / Target Budget: ${budget || "Competitive Price Point"}
- Main Purpose / Driving Routine: ${primaryUse || "Urban Commute & Executive Prestige"}
- Fuel Configuration Preference: ${fuelPref || "Eco hybrid or standard petrol"}
- Size / Distance Range requirement: ${driveRange || "Flexible (Intercity & standard limits)"}

Based ONLY on the following official local vehicle roster, select the TOP 2 best fit models instantly:
1. Corolla Cross Hybrid - (PKR 11.8M to 13.3M, FWD SUV, 24.5 km/l Economy, Hybrid, Highly Recommended for modern family commutes and safety tech)
2. Yaris - (PKR 4.5M to 5.5M, FWD Sedan, 16.8 km/l, Compact, Smart, Reliable for urban traffic)
3. Hilux Revo GR-S - (PKR 14.3M to 16.1M, 4x4 Rugged High Output Diesel Pick-up, built for rough terrains, industrial durability, elite sports suspension)
4. Fortuner Legender - (PKR 18.9M to 21.3M, heavy 7-seater Premium SUV, AWD, absolute stature & luxury prestige)
5. Corolla Altis X Grande - (PKR 5.9M to 7.5M, sedan, elite comfort, national traveler favorite)
6. Land Cruiser 300 ZX - (PKR 115M, Sovereign V6 Twin Turbo SUV, peak of prestige)
7. Camry Hybrid - (PKR 29.9M, Luxury 2.5L Executive Sedan, ultra-premium status)

Write a highly personalized, beautifully crafted executive recommendation response in valid JSON matching this schema:
{
  "recommendedModelName": "Name of top model",
  "recommendedReason": "2 brief sentences describing why it meets budgeting and driving purpose criteria",
  "altModelName": "Alternative model name",
  "altReason": "Short phrase about the secondary option",
  "summaryTip": "A professional driving or fuel energy saving advice tip tailored to Pakistani road circumstances"
}

Ensure the response contains ONLY the clean parsed JSON without any extra characters, codeblocks, markdown formatting, or system text. Or if you use markdown block, just output it carefully so we search or strip it.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text || "{}";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (err) {
      console.error("AI Recommender error:", err);
    }
  }

  // Fallback Rule-Based Smart Diagnostic Recommendation Engine
  let recommendedModelName = "Corolla Cross Hybrid";
  let recommendedReason = "Since you value advanced efficiency and hybrid mobility on local roads, our premium self-charging Hybrid SUV brings unmatched 24.5 km/l utility with elegant safety.";
  let altModelName = "Yaris 1.5L ATIV X";
  let altReason = "A fantastic alternative bringing sleek sedan styling with high reliability for city commutes.";
  let summaryTip = "Utilize EV-mode on slow traffic crawls near central municipal avenues to double battery recharge cycles organically.";

  if (primaryUse === "Off-roading & Utility" || budget === "Over PKR 15M") {
    recommendedModelName = "Hilux Revo GR-S";
    recommendedReason = "Engineered with rugged Gazoo racing chassis setups, ideal for heavy handling, mountain terrain, and high load tolerances.";
    altModelName = "Fortuner Legender";
    altReason = "Premium 3-row leather carriage for executive prestige on intercity roads.";
  } else if (budget === "Under PKR 6M") {
    recommendedModelName = "Yaris 1.3L ATIV CVT";
    recommendedReason = "Perfect balancing point of cost, transmission speed sequentially, and superb inner-cabin technology fits tight urban slots.";
    altModelName = "Corolla X 1.6L Altis";
    altReason = "Robust structural build guaranteeing reliable resale value and spacious commute.";
  }

  res.json({
    recommendedModelName,
    recommendedReason,
    altModelName,
    altReason,
    summaryTip
  });
});

// 2. AI Chatbot assistant
app.post("/api/ai/chat", async (req, res) => {
  const { messages, userProfile } = req.body;
  const lastUserText = messages && messages.length > 0 ? messages[messages.length - 1].text : "Hello DriveSphere Assist";

  let systemInstruction = `You are "DriveSphere Assist", the intelligent luxury AI concierge of DriveSphere Motors, a premium futuristic dealership experience inspired by the Toyota Indus Motor Company (IMC) Network in Pakistan.
Our current collection features:
- Yaris (PKR 4.5M - 5.5M) Dual VVT-i
- Corolla X (Altis & Grande, PKR 5.9M - 7.5M)
- Corolla Cross HEV SUV (Local assembly Hybrid, PKR 11.8M - 13.3M)
- Hilux Revo & Revo GR-S Off-road Pickup (PKR 14.3M - 16.1M)
- Fortuner Legender SUV (PKR 18.9M - 21.3M)
- Camry Luxury Hybrid (PKR 29.9M)
- Hiace Deluxe high-capacity luxury transport (PKR 12.9M - 15.2M)
- Land Cruiser 300 ZX sovereign twin-turbo executive carriage (PKR 115M)

Dealership hubs are located in Karachi (Clifton, Nursery Shahrah-e-Faisal, Sunset Blvd), Lahore (Township, Garden Town), Islamabad, Peshawar, and Quetta.
We also host the 'Toyota Sure' Certified Pre-Owned Vehicle hub, 'Smart Purchase' instant custom leasing tools, and sustainable CSR canopy campaigns.

Respond with executive poise, extreme politeness, precise pricing in PKR, and helpful tips for local driving constraints (e.g. monsoon flooding resilience, fuel price hedging, hybrid battery care). Match user's question directly. Keep responses brief, luxury-warm, and under 3 paragraphs. Avoid code syntax in conversational text.`;

  if (ai) {
    try {
      // Build conversation history
      const formattedHistory = (messages || []).map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      // If history is empty, add user turn
      if (formattedHistory.length === 0) {
        formattedHistory.push({ role: "user", parts: [{ text: lastUserText }] });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });
      return res.json({ text: response.text || "Hello! How can I assist with your DriveSphere query?" });
    } catch (err) {
      console.error("AI Chatbot Error:", err);
    }
  }

  // Beautiful rule-based smart fallback system of DriveSphere
  const queryLower = lastUserText.toLowerCase();
  let text = "Greetings from DriveSphere Luxury Assist! I am happy to provide premium feedback on our vehicle variants, financing guides, and digital dealership centers.";

  if (queryLower.includes("hybrid") || queryLower.includes("corolla cross")) {
    text = "The local-assembly **Corolla Cross Hybrid** (starting from PKR 11,850,000) is exceptionally popular right now in Pakistan. It switches automatically between the 1.8-liter high-efficiency engine and its electric self-charging battery, saving fuel up to 24.5 km/liter. Our Karachi and Lahore showrooms offer instant test-drives.";
  } else if (queryLower.includes("price") || queryLower.includes("cost") || queryLower.includes("pkr")) {
    text = "Our active price guide includes premium local compact models like the **Yaris** (PKR 4.49M - 5.49M), robust **Corolla X** Altis (PKR 5.96M - 7.54M), first-assembled **Corolla Cross Hybrid SUV** (PKR 11.85M - 13.35M), and the commanding off-road **Hilux Revo GR-S** (PKR 14.39M - 16.14M). Booking deposits start from PKR 500,000.";
  } else if (queryLower.includes("finance") || queryLower.includes("loan") || queryLower.includes("lease")) {
    text = "Our **Smart Purchase Financing Program** allows you to configure customizable down payment targets (from 15% to 50%) and competitive lease limits (up to 7 years) with partnered premium banks. Let us set up a tailored calculation draft for Altis Grande or Corolla Cross HEV!";
  } else if (queryLower.includes("dealer") || queryLower.includes("where") || queryLower.includes("karachi") || queryLower.includes("lahore")) {
    text = "We have major executive showroom networks across Pakistan: \n- **Karachi**: DriveSphere Central Motors (Shahrah-e-Faisal) & Western Motors (DHA Sunset Blvd)\n- **Lahore**: Dynamic Township Motors & Garden Motors (Sher Shah Block)\n- **Islamabad**: Sector I-9 Industrial Showroom\nWe can coordinate test-drive schedules directly via our online app checkouts.";
  } else if (queryLower.includes("parts") || queryLower.includes("maintenance") || queryLower.includes("oil")) {
    text = "The DriveSphere Parts Portal features guaranteed 3S-certified items, like Synthetic Motor Lubricating Oil (5W-30 SN/GF-5) starting from PKR 7,850, and OEM Brake Pads. You can reserve items, select workshop points, and pay online.";
  }

  res.json({ text });
});

// ----------------------------------------------------
// BOOTSTRAP EXTRAS & STATIC MIDDLEWARE SETUP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Mounted static files from path: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DriveSphere Full-Stack Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
