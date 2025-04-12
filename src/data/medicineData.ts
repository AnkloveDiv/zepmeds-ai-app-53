
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
    manufacturer: "ScliKort",
    expiryDate: "Jan 2026",
    dosage: "1 tablet daily after breakfast",
    saltComposition: "Ascorbic Acid 1000mg, Zinc 10mg",
    howItWorks: "Vitamin C is an essential nutrient that helps support the immune system by promoting the production of white blood cells, which help fight infections.",
    directions: "Take 1 tablet daily after breakfast with water, or as directed by your physician.",
    quickTips: [
      "Best taken with food to increase absorption",
      "Do not exceed the recommended dose",
      "Store in a cool, dry place"
    ],
    faqs: [
      {
        question: "Can I take vitamin C during pregnancy?",
        answer: "Yes, vitamin C is generally safe during pregnancy, but consult your doctor first."
      },
      {
        question: "How long should I take this supplement?",
        answer: "Vitamin C can be taken daily as a dietary supplement, but consult with your healthcare provider for personalized advice."
      }
    ],
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
    howItWorks: "This digital thermometer uses infrared technology to measure body temperature accurately within seconds without contact.",
    directions: "Point the thermometer at the forehead from 3-5cm distance and press the measurement button.",
    quickTips: [
      "Clean the sensor with alcohol before and after use",
      "Avoid using in direct sunlight",
      "Replace batteries when indicator shows low power"
    ],
    faqs: [
      {
        question: "Is this thermometer accurate?",
        answer: "Yes, it has a clinical accuracy of ±0.2°C when used correctly."
      },
      {
        question: "Can it be used for babies?",
        answer: "Yes, this thermometer is suitable for all ages including infants."
      }
    ]
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
    saltComposition: "Diclofenac Diethylamine 1.16% w/w, Methyl Salicylate 10% w/w, Menthol 5% w/w",
    howItWorks: "This gel works by reducing inflammation and blocking pain signals, providing quick relief from muscle and joint pain.",
    directions: "Apply thin layer to affected area 3-4 times daily with gentle massage until fully absorbed.",
    quickTips: [
      "Wash hands before and after application",
      "Do not apply on broken skin",
      "Avoid contact with eyes and mucous membranes"
    ],
    faqs: [
      {
        question: "Is this gel safe during pregnancy?",
        answer: "Not recommended during pregnancy without doctor's consultation."
      },
      {
        question: "How long does it take to feel relief?",
        answer: "Most users feel relief within 15-30 minutes after application."
      }
    ]
  },
  { 
    id: "4", 
    name: "Multivitamin Capsules", 
    image: multivitaminImg, 
    price: 450, 
    discountPrice: 410, 
    rating: 4.7, 
    description: "Daily Nutrition", 
    category: "Popular",
    fullDescription: "Complete multivitamin formula with essential vitamins and minerals to support overall health and well-being.",
    manufacturer: "NutriLife",
    expiryDate: "Mar 2026",
    saltComposition: "Vitamins A, B-complex, C, D, E, K, Calcium, Magnesium, Zinc, Iron",
    howItWorks: "This comprehensive formula provides essential nutrients that may be missing from your diet, supporting overall health and bodily functions.",
    directions: "Take 1 capsule daily with food or as directed by your healthcare provider.",
    quickTips: [
      "Best taken with a meal for optimal absorption",
      "Store in a cool, dry place",
      "Set a daily reminder to maintain consistency"
    ],
    faqs: [
      {
        question: "When is the best time to take multivitamins?",
        answer: "Most multivitamins are best taken with a meal to improve absorption and reduce potential stomach upset."
      },
      {
        question: "Can children take these multivitamins?",
        answer: "This formulation is designed for adults. Children should use age-appropriate vitamins."
      }
    ],
    sideEffects: ["Mild stomach discomfort", "Change in urine color"],
    ingredients: ["Vitamins A, B-complex, C, D, E, K", "Minerals (Calcium, Magnesium, Zinc, Iron)", "Antioxidants"]
  },
  { 
    id: "5", 
    name: "Blood Pressure Monitor", 
    image: bpMonitorImg, 
    price: 1800, 
    discountPrice: 1499, 
    rating: 4.3, 
    description: "Digital Monitor", 
    category: "Brain",
    fullDescription: "Advanced digital blood pressure monitor with high accuracy and memory function to store readings.",
    manufacturer: "HealthSense",
    expiryDate: "N/A",
    howItWorks: "This device uses oscillometric technology to measure systolic and diastolic blood pressure as well as pulse rate.",
    directions: "Place the cuff on your upper arm, align with your heart, sit in a relaxed position, and press start.",
    quickTips: [
      "Rest for 5 minutes before measuring",
      "Keep arm at heart level during measurement",
      "Avoid caffeine or exercise 30 minutes before"
    ],
    faqs: [
      {
        question: "How often should I check my blood pressure?",
        answer: "Follow your doctor's recommendation, typically once or twice daily for those monitoring blood pressure."
      },
      {
        question: "Can different people use the same device?",
        answer: "Yes, but each user should create their own profile on the device to track readings separately."
      }
    ]
  },
  { 
    id: "6", 
    name: "Hand Sanitizer", 
    image: sanitizerImg, 
    price: 150, 
    discountPrice: 120, 
    rating: 4.1, 
    description: "99.9% Germ Protection", 
    category: "Popular",
    fullDescription: "Alcohol-based hand sanitizer that kills 99.9% of germs and bacteria without water.",
    manufacturer: "PureLife",
    expiryDate: "Feb 2026",
    howItWorks: "The high alcohol content disrupts bacterial cell membranes, effectively killing most harmful microorganisms.",
    directions: "Apply a coin-sized amount to palms and rub thoroughly over all surfaces of hands until dry.",
    quickTips: [
      "Use when soap and water aren't available",
      "Ensure hands are visibly clean before use",
      "Keep away from flame or heat sources"
    ],
    faqs: [
      {
        question: "Is hand sanitizer as effective as washing with soap?",
        answer: "Hand washing is preferred when available, but sanitizer is effective for on-the-go germ protection."
      },
      {
        question: "How much should I use each time?",
        answer: "Use enough to cover all surfaces of your hands, typically a dime to quarter-sized amount."
      }
    ]
  },
  { 
    id: "7", 
    name: "Eye Drops", 
    image: eyeDropsImg, 
    price: 180, 
    discountPrice: 150, 
    rating: 4.2, 
    description: "Relieves Dryness", 
    category: "Eye Care",
    fullDescription: "Lubricating eye drops that provide long-lasting relief from dryness, irritation, and eye strain.",
    manufacturer: "Ocusoft",
    expiryDate: "Nov 2025",
    saltComposition: "Carboxymethylcellulose Sodium 0.5%, Glycerin",
    howItWorks: "These drops supplement natural tears by providing additional lubrication to the eye surface, relieving dryness and irritation.",
    directions: "Tilt head back, pull down lower eyelid, place 1-2 drops in the eye, and blink several times.",
    quickTips: [
      "Wash hands before application",
      "Don't touch dropper tip to eye or any surface",
      "Discard 28 days after opening"
    ],
    faqs: [
      {
        question: "Can I use these with contact lenses?",
        answer: "Remove contacts before use, wait 15 minutes before reinserting, or check for 'safe for contacts' on the label."
      },
      {
        question: "How often can I use eye drops?",
        answer: "Follow package directions, typically 3-4 times daily or as needed for symptoms."
      }
    ]
  },
  { 
    id: "8", 
    name: "Dental Floss", 
    image: dentalFlossImg, 
    price: 120, 
    discountPrice: null, 
    rating: 4.0, 
    description: "Complete Care", 
    category: "Dental",
    fullDescription: "Waxed dental floss that glides easily between teeth to remove plaque and food particles.",
    manufacturer: "OralCare",
    expiryDate: "N/A",
    howItWorks: "The thin filament removes plaque and food particles from between teeth where brushing can't reach.",
    directions: "Break off 18 inches of floss, wind around fingers, gently slide between teeth and curve around each tooth.",
    quickTips: [
      "Use daily as part of oral hygiene routine",
      "Move to a fresh section of floss for each tooth",
      "Be gentle to avoid gum injury"
    ],
    faqs: [
      {
        question: "Is flossing really necessary if I brush thoroughly?",
        answer: "Yes, flossing reaches areas between teeth that brushing cannot clean effectively."
      },
      {
        question: "Should I floss before or after brushing?",
        answer: "Dental professionals recommend flossing before brushing for more effective plaque removal."
      }
    ]
  },
  { 
    id: "9", 
    name: "Sunscreen Lotion", 
    image: sunscreenImg, 
    price: 280, 
    discountPrice: 250, 
    rating: 4.6, 
    description: "SPF 50+", 
    category: "Summer",
    fullDescription: "Broad-spectrum SPF 50+ sunscreen lotion that protects against UVA and UVB rays while being water-resistant.",
    manufacturer: "SunBlock",
    expiryDate: "Aug 2025",
    saltComposition: "Avobenzone 3%, Octinoxate 7.5%, Octisalate 5%, Titanium Dioxide 2%",
    howItWorks: "This sunscreen forms a protective barrier on the skin that either absorbs or reflects harmful UV radiation.",
    directions: "Apply liberally 15 minutes before sun exposure. Reapply every 2 hours and after swimming or sweating.",
    quickTips: [
      "Use year-round, not just in summer",
      "Don't forget ears, neck, and feet",
      "Store in cool place to maintain effectiveness"
    ],
    faqs: [
      {
        question: "Is SPF 50 much better than SPF 30?",
        answer: "SPF 30 blocks 97% of UVB rays, while SPF 50 blocks 98%. The difference is small but may benefit very fair skin."
      },
      {
        question: "How much sunscreen should I apply?",
        answer: "Most adults need about 1 ounce (a shot glass full) to cover the body properly."
      }
    ]
  },
  { 
    id: "10", 
    name: "Memory Supplement", 
    image: memorySupplementImg, 
    price: 450, 
    discountPrice: 399, 
    rating: 4.3, 
    description: "Cognitive Support", 
    category: "Brain",
    fullDescription: "Advanced formula with natural ingredients to support brain function, memory, and cognitive performance.",
    manufacturer: "BrainBoost",
    expiryDate: "Apr 2026",
    saltComposition: "Bacopa Monnieri, Ginkgo Biloba, Phosphatidylserine, DHA",
    howItWorks: "The ingredients work synergistically to improve blood flow to the brain, protect neurons, and optimize neurotransmitter function.",
    directions: "Take 1 capsule twice daily with meals, or as directed by your healthcare provider.",
    quickTips: [
      "Consistent use shows better results",
      "Combine with mental activities for best results",
      "Results typically noticed after 4-6 weeks"
    ],
    faqs: [
      {
        question: "At what age should one start taking memory supplements?",
        answer: "There's no specific age, but many people start in their 40s or when noticing cognitive changes."
      },
      {
        question: "Do these interact with medications?",
        answer: "Some ingredients may interact with blood thinners or other medications. Always consult your doctor."
      }
    ],
    sideEffects: ["Mild headache", "Digestive discomfort", "Dizziness (rare)"],
    ingredients: ["Bacopa Monnieri", "Ginkgo Biloba", "Phosphatidylserine", "DHA", "Vitamins B6, B12, and E"]
  },
  { 
    id: "11", 
    name: "Reading Glasses", 
    image: readingGlassesImg, 
    price: 800, 
    discountPrice: 650, 
    rating: 4.1, 
    description: "Anti-Glare", 
    category: "Eye Care",
    fullDescription: "Stylish reading glasses with anti-glare coating, blue light protection, and spring hinges for comfort.",
    manufacturer: "VisionPlus",
    expiryDate: "N/A",
    howItWorks: "These glasses magnify text and reduce eye strain with anti-reflective coating that cuts glare and filters blue light.",
    directions: "Choose the right strength based on your reading needs. Clean regularly with microfiber cloth.",
    quickTips: [
      "Keep in protective case when not in use",
      "Clean with lens cleaner, not household cleaners",
      "Replace if scratched or damaged"
    ],
    faqs: [
      {
        question: "How do I know what strength I need?",
        answer: "Start with lower power (+1.00 to +1.50) if you're in your 40s and adjust based on comfort."
      },
      {
        question: "Can I wear these all day?",
        answer: "Reading glasses are designed for close-up tasks. For all-day vision correction, consult an optometrist."
      }
    ]
  },
  { 
    id: "12", 
    name: "Muscle Pain Cream", 
    image: musclePainImg, 
    price: 190, 
    discountPrice: 160, 
    rating: 4.4, 
    description: "Fast Acting", 
    category: "Pain",
    fullDescription: "Deep-penetrating analgesic cream that provides quick relief from muscle aches, joint pain, and backaches.",
    manufacturer: "FlexiCare",
    expiryDate: "Jul 2025",
    saltComposition: "Methyl Salicylate 15%, Menthol 10%, Camphor 3.5%",
    howItWorks: "This cream creates a heating and cooling sensation that interrupts pain signals while increasing blood flow to the area.",
    directions: "Apply a thin layer to affected area and gently massage until absorbed. Repeat 3-4 times daily.",
    quickTips: [
      "Test on small area first to check for sensitivity",
      "Don't use with heating pad or bandage",
      "Wash hands thoroughly after application"
    ],
    faqs: [
      {
        question: "Is it safe to use during pregnancy?",
        answer: "Consult your doctor before using any pain relief products during pregnancy."
      },
      {
        question: "How long does the relief last?",
        answer: "Most users experience relief for 4-6 hours after application."
      }
    ],
    sideEffects: ["Skin irritation in sensitive individuals", "Temporary warming or cooling sensation"],
    ingredients: ["Methyl Salicylate", "Menthol", "Camphor", "Aloe Vera", "Arnica Extract"]
  }
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
