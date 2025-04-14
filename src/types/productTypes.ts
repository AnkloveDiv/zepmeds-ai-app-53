
export interface TrendingProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  rating: number;
  description?: string;
  fullDescription?: string;
  manufacturer?: string;
  expiryDate?: string;
  dosage?: string;
  sideEffects?: string[];
  ingredients?: string[];
  saltComposition?: string;
  howItWorks?: string;
  directions?: string;
  quickTips?: string[];
  faqs?: { question: string; answer: string }[];
  category?: string;
  inStock?: boolean;
}
