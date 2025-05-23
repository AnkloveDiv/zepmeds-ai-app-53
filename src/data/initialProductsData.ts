
import { TrendingProduct } from "@/types/productTypes";
import { vitaminCImg, thermometerImg, painReliefImg, multivitaminImg } from "./medicineData";

// Initial products data
export const initialProducts: TrendingProduct[] = [
  { 
    id: "prod1", 
    name: "Vitamin C Tablets", 
    image: vitaminCImg, 
    price: 350, 
    discountPrice: 280, 
    rating: 4.5, 
    description: "Immunity Booster",
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
    ingredients: ["Ascorbic Acid", "Zinc", "Rose Hip Extract"],
    inStock: true
  },
  { 
    id: "prod2", 
    name: "Digital Thermometer", 
    image: thermometerImg, 
    price: 500, 
    discountPrice: 399, 
    rating: 4.2, 
    description: "Accurate Reading",
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
    ],
    inStock: false
  },
  { 
    id: "prod3", 
    name: "Pain Relief Gel", 
    image: painReliefImg, 
    price: 220, 
    discountPrice: null, 
    rating: 4.0, 
    description: "Fast Relief",
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
    ],
    inStock: true
  },
  { 
    id: "prod4", 
    name: "Multivitamin Capsules", 
    image: multivitaminImg, 
    price: 450, 
    discountPrice: 410, 
    rating: 4.7, 
    description: "Daily Nutrition",
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
    ingredients: ["Vitamins A, B-complex, C, D, E, K", "Minerals (Calcium, Magnesium, Zinc, Iron)", "Antioxidants"],
    inStock: false
  }
];
