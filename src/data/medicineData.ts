
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

export const allProducts = [
  { 
    id: "1", 
    name: "Vitamin C Tablets", 
    image: vitaminCImg, 
    price: 350, 
    discountPrice: 280, 
    rating: 4.5, 
    description: "Immunity Booster", 
    category: "Popular",
    fullDescription: "Vitamin C complex with 1000mg of ascorbic acid to boost your immunity. Contains added Zinc for enhanced cold & flu protection.",
    manufacturer: "Sclikort",
    expiryDate: "Jan 2026",
    dosage: "1 tablet daily after breakfast",
    sideEffects: ["Nausea", "Stomach cramps", "Diarrhea in high doses"],
    ingredients: ["Ascorbic Acid", "Zinc", "Rose Hip Extract"]
  },
  { 
    id: "2", 
    name: "Digital Thermometer", 
    image: thermometerImg, 
    price: 500, 
    discountPrice: 399, 
    rating: 4.2, 
    description: "Accurate Reading", 
    category: "Summer",
    fullDescription: "Digital infrared thermometer by Fidelis Healthcare for accurate temperature readings. Features LCD screen and quick reading technology.",
    manufacturer: "Fidelis Healthcare",
    expiryDate: "N/A",
    dosage: "Place temperature probe for accurate reading"
  },
  { 
    id: "3", 
    name: "Pain Relief Gel", 
    image: painReliefImg, 
    price: 220, 
    discountPrice: null, 
    rating: 4.0, 
    description: "Fast Relief", 
    category: "Pain",
    fullDescription: "Quick-absorbing gel that provides fast relief from muscle and joint pain. Contains natural ingredients for long-lasting effect.",
    manufacturer: "Relief Pharma",
    expiryDate: "Dec 2025",
    dosage: "Apply thin layer to affected area 3-4 times daily"
  },
  { id: "4", name: "Multivitamin Capsules", image: multivitaminImg, price: 450, discountPrice: 410, rating: 4.7, description: "Daily Nutrition", category: "Popular" },
  { id: "5", name: "Blood Pressure Monitor", image: bpMonitorImg, price: 1800, discountPrice: 1499, rating: 4.3, description: "Digital Monitor", category: "Brain" },
  { id: "6", name: "Hand Sanitizer", image: sanitizerImg, price: 150, discountPrice: 120, rating: 4.1, description: "99.9% Germ Protection", category: "Popular" },
  { id: "7", name: "Eye Drops", image: eyeDropsImg, price: 180, discountPrice: 150, rating: 4.2, description: "Relieves Dryness", category: "Eye Care" },
  { id: "8", name: "Dental Floss", image: dentalFlossImg, price: 120, discountPrice: null, rating: 4.0, description: "Complete Care", category: "Dental" },
  { id: "9", name: "Sunscreen Lotion", image: sunscreenImg, price: 280, discountPrice: 250, rating: 4.6, description: "SPF 50+", category: "Summer" },
  { id: "10", name: "Memory Supplement", image: memorySupplementImg, price: 450, discountPrice: 399, rating: 4.3, description: "Cognitive Support", category: "Brain" },
  { id: "11", name: "Reading Glasses", image: readingGlassesImg, price: 800, discountPrice: 650, rating: 4.1, description: "Anti-Glare", category: "Eye Care" },
  { id: "12", name: "Muscle Pain Cream", image: musclePainImg, price: 190, discountPrice: 160, rating: 4.4, description: "Fast Acting", category: "Pain" }
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
