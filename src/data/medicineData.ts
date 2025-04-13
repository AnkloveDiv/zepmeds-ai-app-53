
export const vitaminCImg = "public/lovable-uploads/dc2b9862-8412-4aab-a048-3f4f99be1b92.png";
export const thermometerImg = "public/lovable-uploads/e5ea8812-e4a9-417f-a5ea-550ee2118033.png";
export const painReliefImg = "public/lovable-uploads/6bb42333-19b2-427c-8513-33700eab7846.png";
export const multivitaminImg = "public/lovable-uploads/8e2869b3-2f4a-429c-93a4-75e1011e9c3e.png";
export const bpMonitorImg = "public/lovable-uploads/6d2f2fdd-2890-4d6a-8a19-e29674e2424e.png";
export const sanitizerImg = "https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const eyeDropsImg = "public/lovable-uploads/2c409cfa-35bb-4435-8085-96a5172bfb23.png";
export const dentalFlossImg = "public/lovable-uploads/d99e64a7-6f7d-432b-8248-977079ffdb52.png";
export const sunscreenImg = "public/lovable-uploads/8c1600b9-be8f-44d2-b739-73ae97b8352c.png";
export const memorySupplementImg = "public/lovable-uploads/4eef09cb-e7b9-47de-9d7e-a5a8e1a3a2de.png";
export const readingGlassesImg = "public/lovable-uploads/58b52a15-d4c7-4b68-b54f-e25882f87a4f.png";
export const musclePainImg = "https://images.unsplash.com/photo-1616091238995-af68d2711aec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

// POPULAR CATEGORY - 4 products
const popularProducts = [
  { 
    id: "pop1", 
    name: "Vitamin C Tablets", 
    image: vitaminCImg, 
    price: 350, 
    discountPrice: 280, 
    rating: 4.5, 
    description: "Immunity Booster", 
    category: "Popular",
    fullDescription: "Vitamin C complex with 1000mg of ascorbic acid to boost your immunity. Contains added Zinc for enhanced cold & flu protection.",
    manufacturer: "ScliKort",
    expiryDate: "Jan 2026"
  },
  { 
    id: "pop2", 
    name: "Multivitamin Capsules", 
    image: multivitaminImg, 
    price: 450, 
    discountPrice: 410, 
    rating: 4.7, 
    description: "Daily Nutrition", 
    category: "Popular",
    fullDescription: "Complete multivitamin formula with essential vitamins and minerals to support overall health and well-being."
  },
  { 
    id: "pop3", 
    name: "Hand Sanitizer", 
    image: sanitizerImg, 
    price: 150, 
    discountPrice: 120, 
    rating: 4.1, 
    description: "99.9% Germ Protection", 
    category: "Popular",
    fullDescription: "Alcohol-based hand sanitizer that kills 99.9% of germs and bacteria without water."
  },
  { 
    id: "pop4", 
    name: "Immunity Booster Syrup", 
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 520, 
    discountPrice: 450, 
    rating: 4.6, 
    description: "Natural Formula", 
    category: "Popular",
    fullDescription: "Natural herbal immunity booster with honey, tulsi, and amla extract. Suitable for all ages above 12."
  }
];

// SKIN CARE CATEGORY - 4 products
const skinCareProducts = [
  { 
    id: "skin1", 
    name: "Acne Control Gel", 
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 310, 
    discountPrice: 275, 
    rating: 4.3, 
    description: "Clears Acne Fast", 
    category: "Skin Care",
    fullDescription: "Salicylic acid based formula helps clear acne and prevent new breakouts. Gentle enough for daily use."
  },
  { 
    id: "skin2", 
    name: "Face Moisturizer", 
    image: "https://images.unsplash.com/photo-1570178096415-c05d8f6b3f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 380, 
    discountPrice: 350, 
    rating: 4.5, 
    description: "24h Hydration", 
    category: "Skin Care",
    fullDescription: "Non-greasy formula that provides 24-hour hydration. Contains hyaluronic acid and ceramides."
  },
  { 
    id: "skin3", 
    name: "Anti-Aging Serum", 
    image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 850, 
    discountPrice: 750, 
    rating: 4.7, 
    description: "Reduces Wrinkles", 
    category: "Skin Care",
    fullDescription: "Advanced formula with retinol and vitamin C to reduce fine lines and brighten skin. Apply nightly for best results."
  },
  { 
    id: "skin4", 
    name: "Eczema Relief Cream", 
    image: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 420, 
    discountPrice: 380, 
    rating: 4.4, 
    description: "Soothes Irritation", 
    category: "Skin Care",
    fullDescription: "Specially formulated for sensitive skin. Relieves itching and irritation from eczema and dry skin conditions."
  }
];

// SUPPLEMENTS CATEGORY - 4 products
const supplementsProducts = [
  { 
    id: "supp1", 
    name: "Protein Powder", 
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 780, 
    discountPrice: 650, 
    rating: 4.5, 
    description: "Muscle Recovery", 
    category: "Supplements",
    fullDescription: "High-quality whey protein with 24g protein per serving. Supports muscle recovery and growth after workouts."
  },
  { 
    id: "supp2", 
    name: "Omega-3 Capsules", 
    image: "https://images.unsplash.com/photo-1577460551100-907fc6a6e5ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 420, 
    discountPrice: 380, 
    rating: 4.3, 
    description: "Heart Health", 
    category: "Supplements",
    fullDescription: "Pure fish oil capsules rich in EPA and DHA. Supports heart, brain, and joint health. Take daily with food."
  },
  { 
    id: "supp3", 
    name: "Memory Supplement", 
    image: memorySupplementImg, 
    price: 450, 
    discountPrice: 399, 
    rating: 4.3, 
    description: "Cognitive Support", 
    category: "Supplements",
    fullDescription: "Advanced formula with natural ingredients to support brain function, memory, and cognitive performance."
  },
  { 
    id: "supp4", 
    name: "Iron Tablets", 
    image: "https://images.unsplash.com/photo-1584308074605-b0a91a5c399d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 280, 
    discountPrice: 240, 
    rating: 4.2, 
    description: "Energy Boost", 
    category: "Supplements",
    fullDescription: "Ferrous sulfate tablets to help maintain healthy iron levels. Includes vitamin C for better absorption."
  }
];

// EYE CARE CATEGORY - 4 products
const eyeCareProducts = [
  { 
    id: "eye1", 
    name: "Eye Drops", 
    image: eyeDropsImg, 
    price: 180, 
    discountPrice: 150, 
    rating: 4.2, 
    description: "Relieves Dryness", 
    category: "Eye Care",
    fullDescription: "Lubricating eye drops that provide long-lasting relief from dryness, irritation, and eye strain."
  },
  { 
    id: "eye2", 
    name: "Reading Glasses", 
    image: readingGlassesImg, 
    price: 800, 
    discountPrice: 650, 
    rating: 4.1, 
    description: "Anti-Glare", 
    category: "Eye Care",
    fullDescription: "Stylish reading glasses with anti-glare coating, blue light protection, and spring hinges for comfort."
  },
  { 
    id: "eye3", 
    name: "Blue Light Glasses", 
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 950, 
    discountPrice: 830, 
    rating: 4.5, 
    description: "Screen Protection", 
    category: "Eye Care",
    fullDescription: "Specially designed glasses that filter blue light from digital screens, reducing eye strain and improving sleep quality."
  },
  { 
    id: "eye4", 
    name: "Eye Vitamin Complex", 
    image: "https://images.unsplash.com/photo-1626397806641-0ac60f99163a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 520, 
    discountPrice: 480, 
    rating: 4.3, 
    description: "Macular Support", 
    category: "Eye Care",
    fullDescription: "Contains lutein, zeaxanthin, and vitamin A to support eye health and protect against age-related macular degeneration."
  }
];

// DEVICES CATEGORY - 4 products
const devicesProducts = [
  { 
    id: "dev1", 
    name: "Digital Thermometer", 
    image: thermometerImg, 
    price: 500, 
    discountPrice: 399, 
    rating: 4.2, 
    description: "Accurate Reading", 
    category: "Devices",
    fullDescription: "Digital infrared thermometer by Fidelis Healthcare for accurate temperature readings. Features LCD screen and quick reading technology."
  },
  { 
    id: "dev2", 
    name: "Blood Pressure Monitor", 
    image: bpMonitorImg, 
    price: 1800, 
    discountPrice: 1499, 
    rating: 4.3, 
    description: "Digital Monitor", 
    category: "Devices",
    fullDescription: "Advanced digital blood pressure monitor with high accuracy and memory function to store readings."
  },
  { 
    id: "dev3", 
    name: "Pulse Oximeter", 
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 1200, 
    discountPrice: 999, 
    rating: 4.4, 
    description: "Blood Oxygen", 
    category: "Devices",
    fullDescription: "Fingertip pulse oximeter that measures blood oxygen saturation levels (SpO2) and pulse rate in seconds."
  },
  { 
    id: "dev4", 
    name: "Nebulizer Machine", 
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b9529?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 1650, 
    discountPrice: 1450, 
    rating: 4.5, 
    description: "Respiratory Aid", 
    category: "Devices",
    fullDescription: "Portable compressor nebulizer for effective delivery of respiratory medications. Ideal for asthma and COPD patients."
  }
];

// PAIN RELIEF CATEGORY - 4 products
const painReliefProducts = [
  { 
    id: "pain1", 
    name: "Pain Relief Gel", 
    image: painReliefImg, 
    price: 220, 
    discountPrice: null, 
    rating: 4.0, 
    description: "Fast Relief", 
    category: "Pain Relief",
    fullDescription: "Quick-absorbing gel that provides fast relief from muscle and joint pain. Contains natural ingredients for long-lasting effect."
  },
  { 
    id: "pain2", 
    name: "Muscle Pain Cream", 
    image: musclePainImg, 
    price: 190, 
    discountPrice: 160, 
    rating: 4.4, 
    description: "Fast Acting", 
    category: "Pain Relief",
    fullDescription: "Deep-penetrating analgesic cream that provides quick relief from muscle aches, joint pain, and backaches."
  },
  { 
    id: "pain3", 
    name: "Hot Pain Relief Patch", 
    image: "https://images.unsplash.com/photo-1611073561609-cdc220ee3b6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 350, 
    discountPrice: 299, 
    rating: 4.3, 
    description: "24h Relief", 
    category: "Pain Relief",
    fullDescription: "Self-heating patches that provide up to 24 hours of continuous pain relief for back, neck, and shoulder pain."
  },
  { 
    id: "pain4", 
    name: "Headache Relief Tablets", 
    image: "https://images.unsplash.com/photo-1550572017-9cf472d79a9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 180, 
    discountPrice: 150, 
    rating: 4.6, 
    description: "Fast Migraine Relief", 
    category: "Pain Relief",
    fullDescription: "Rapid-acting tablets that provide effective relief from headaches, migraines, and associated symptoms."
  }
];

// SUMMER CARE CATEGORY - 4 products
const summerCareProducts = [
  { 
    id: "sum1", 
    name: "Sunscreen Lotion", 
    image: sunscreenImg, 
    price: 280, 
    discountPrice: 250, 
    rating: 4.6, 
    description: "SPF 50+", 
    category: "Summer Care",
    fullDescription: "Broad-spectrum SPF 50+ sunscreen lotion that protects against UVA and UVB rays while being water-resistant."
  },
  { 
    id: "sum2", 
    name: "Aloe Vera Gel", 
    image: "https://images.unsplash.com/photo-1570274042432-ba9980e4c62a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 150, 
    discountPrice: 120, 
    rating: 4.5, 
    description: "Cooling Effect", 
    category: "Summer Care",
    fullDescription: "Pure aloe vera gel that soothes sunburns, cools skin, and hydrates. Can be refrigerated for enhanced cooling effect."
  },
  { 
    id: "sum3", 
    name: "Prickly Heat Powder", 
    image: "https://images.unsplash.com/photo-1608571423902-a13f7c476244?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 120, 
    discountPrice: 99, 
    rating: 4.2, 
    description: "Anti-Rash", 
    category: "Summer Care",
    fullDescription: "Medicated cooling powder that prevents and relieves prickly heat rash. Absorbs sweat and keeps skin dry."
  },
  { 
    id: "sum4", 
    name: "Rehydration Salts", 
    image: "https://images.unsplash.com/photo-1614772903208-ae49dfc8913c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 90, 
    discountPrice: 75, 
    rating: 4.4, 
    description: "Electrolyte Balance", 
    category: "Summer Care",
    fullDescription: "Oral rehydration salts that quickly replenish electrolytes lost due to sweating, heat exposure, or mild dehydration."
  }
];

// DENTAL CARE CATEGORY - 4 products
const dentalProducts = [
  { 
    id: "dent1", 
    name: "Dental Floss", 
    image: dentalFlossImg, 
    price: 120, 
    discountPrice: null, 
    rating: 4.0, 
    description: "Complete Care", 
    category: "Dental",
    fullDescription: "Waxed dental floss that glides easily between teeth to remove plaque and food particles."
  },
  { 
    id: "dent2", 
    name: "Toothache Gel", 
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 140, 
    discountPrice: 125, 
    rating: 4.2, 
    description: "Instant Relief", 
    category: "Dental",
    fullDescription: "Fast-acting gel that provides temporary relief from toothache. Contains benzocaine for numbing effect."
  },
  { 
    id: "dent3", 
    name: "Sensitive Toothpaste", 
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 180, 
    discountPrice: 160, 
    rating: 4.5, 
    description: "Reduces Sensitivity", 
    category: "Dental",
    fullDescription: "Specially formulated toothpaste that builds protection against sensitive teeth and provides long-lasting relief."
  },
  { 
    id: "dent4", 
    name: "Mouthwash", 
    image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 160, 
    discountPrice: 140, 
    rating: 4.3, 
    description: "Fresh Breath", 
    category: "Dental",
    fullDescription: "Alcohol-free antibacterial mouthwash that kills germs, prevents plaque, and provides long-lasting fresh breath."
  }
];

// PET CARE CATEGORY - 4 products
const petCareProducts = [
  { 
    id: "pet1", 
    name: "Pet Multivitamins", 
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 450, 
    discountPrice: 399, 
    rating: 4.5, 
    description: "Complete Nutrition", 
    category: "Pet Care",
    fullDescription: "Comprehensive multivitamin formula designed specifically for dogs. Supports immune system, joint health, and coat quality."
  },
  { 
    id: "pet2", 
    name: "Flea & Tick Drops", 
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 780, 
    discountPrice: 699, 
    rating: 4.3, 
    description: "3-Month Protection", 
    category: "Pet Care",
    fullDescription: "Veterinary-strength formula that protects cats and dogs from fleas, ticks, and lice for up to 3 months."
  },
  { 
    id: "pet3", 
    name: "Pet Wound Spray", 
    image: "https://images.unsplash.com/photo-1444212477490-ca407925329e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 320, 
    discountPrice: 280, 
    rating: 4.2, 
    description: "Antiseptic Care", 
    category: "Pet Care",
    fullDescription: "No-sting antiseptic spray for pets that cleans wounds, aids healing, and prevents infection. Safe if licked after drying."
  },
  { 
    id: "pet4", 
    name: "Calming Treats", 
    image: "https://images.unsplash.com/photo-1588269845464-8993565cac3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    price: 290, 
    discountPrice: 250, 
    rating: 4.4, 
    description: "Stress Relief", 
    category: "Pet Care",
    fullDescription: "Natural calming treats for dogs and cats to reduce anxiety during thunderstorms, fireworks, travel, or separation."
  }
];

// Combine all products into one array
export const allProducts = [
  ...popularProducts,
  ...skinCareProducts,
  ...supplementsProducts,
  ...eyeCareProducts,
  ...devicesProducts,
  ...painReliefProducts,
  ...summerCareProducts,
  ...dentalProducts,
  ...petCareProducts
];

export const advertisements = [
  {
    id: 'ad1',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    title: 'New Anti-Allergic Range by HealthPlus',
    sponsor: 'HealthPlus',
    url: 'https://example.com/healthplus'
  },
  {
    id: 'ad2',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    title: 'Immunity Booster Sale - 25% Off',
    sponsor: 'Wellness Pharma',
    url: 'https://example.com/wellness'
  }
];
