
export interface Doctor {
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  price: number;
  available: boolean;
  bio: string;
}

export const doctors: Doctor[] = [
  { 
    name: "Dr. Sharma", 
    specialty: "Cardiologist", 
    experience: 12, 
    rating: 4.8, 
    price: 600, 
    available: true, 
    bio: "Specialist in cardiovascular diseases with over 12 years of experience. MBBS, MD from AIIMS." 
  },
  { 
    name: "Dr. Patel", 
    specialty: "Neurologist", 
    experience: 8, 
    rating: 4.6, 
    price: 800, 
    available: true, 
    bio: "Expert in neurological disorders and brain health. Trained at John Hopkins University." 
  },
  { 
    name: "Dr. Reddy", 
    specialty: "Dentist", 
    experience: 10, 
    rating: 4.9, 
    price: 500, 
    available: false, 
    bio: "Dental surgeon specializing in cosmetic dentistry and oral health." 
  },
  { 
    name: "Dr. Kumar", 
    specialty: "Pediatrician", 
    experience: 15, 
    rating: 4.7, 
    price: 700, 
    available: true, 
    bio: "Child health specialist with focus on developmental pediatrics and preventive care." 
  }
];

export const availableTimes: string[] = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", 
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];
