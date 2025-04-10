
export const vitaminCImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const thermometerImg = "https://images.unsplash.com/photo-1588613254750-bc14209ae7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const painReliefImg = "https://images.unsplash.com/photo-1558956546-130eb5b8ba93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const multivitaminImg = "https://images.unsplash.com/photo-1579165466741-7f35e4755183?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const bpMonitorImg = "https://images.unsplash.com/photo-1631815588090-d4bfec5b9a1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const sanitizerImg = "https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const eyeDropsImg = "https://images.unsplash.com/photo-1616668983570-a971f3e35c62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const dentalFlossImg = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const sunscreenImg = "https://images.unsplash.com/photo-1521223619409-8071a04a1b78?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const memorySupplementImg = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
export const readingGlassesImg = "https://images.unsplash.com/photo-1483412468200-72182a492cdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
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
    fullDescription: "Vitamin C supplements containing 1000mg of ascorbic acid to boost your immunity. Take one tablet daily for optimal results.",
    manufacturer: "HealthPlus Inc.",
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
    fullDescription: "Digital infrared thermometer for accurate temperature readings within seconds. Easy to use and clean.",
    manufacturer: "MediTech",
    expiryDate: "N/A",
    dosage: "Place 1cm away from forehead for reading"
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
