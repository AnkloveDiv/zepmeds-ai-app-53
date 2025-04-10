
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// HD Medicine brand ads
const adFlyers = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1240&q=80",
    title: "Summer Health Essentials",
    subtitle: "20% off on all summer products",
    color: "from-blue-600 to-purple-600",
    brand: "MedLife"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1240&q=80",
    title: "Vitamin Supplements",
    subtitle: "Buy 2 Get 1 Free",
    color: "from-orange-500 to-red-500",
    brand: "HealthPlus"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1240&q=80",
    title: "Diabetes Care",
    subtitle: "Free Blood Sugar Monitor",
    color: "from-green-500 to-teal-500",
    brand: "MedOne"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1240&q=80",
    title: "Heart Health",
    subtitle: "BP Monitor at 30% off",
    color: "from-red-500 to-pink-500",
    brand: "CardioLife"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1240&q=80",
    title: "Immunity Boosters",
    subtitle: "New range of herbal products",
    color: "from-purple-500 to-indigo-500",
    brand: "NatureVita"
  }
];

const AdFlyer = () => {
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto play the carousel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay) {
      interval = setInterval(() => {
        const nextButton = document.querySelector('[data-carousel-next]') as HTMLButtonElement;
        if (nextButton) nextButton.click();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay]);

  return (
    <section className="mt-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-3">Featured Brands</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <CarouselContent>
          {adFlyers.map((ad) => (
            <CarouselItem key={ad.id} className="sm:basis-1/2 md:basis-1/3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`h-48 rounded-xl overflow-hidden relative bg-gradient-to-r ${ad.color}`}
              >
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
                />
                <div className="absolute top-2 left-2 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Sponsored by {ad.brand}</span>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <h3 className="text-xl font-bold drop-shadow-md">{ad.title}</h3>
                  <p className="text-sm drop-shadow-md">{ad.subtitle}</p>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious data-carousel-prev className="left-2 bg-black/30 hover:bg-black/50 border-none text-white" />
          <CarouselNext data-carousel-next className="right-2 bg-black/30 hover:bg-black/50 border-none text-white" />
        </div>
      </Carousel>
    </section>
  );
};

export default AdFlyer;
