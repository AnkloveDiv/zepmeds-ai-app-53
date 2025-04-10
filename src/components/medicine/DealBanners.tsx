
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Data for the deal banners
const dealBanners = [
  {
    id: 'deal1',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    title: 'Summer Health Sale',
    discount: '30% OFF'
  },
  {
    id: 'deal2',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    title: 'Diabetes Care',
    discount: 'Buy 1 Get 1'
  },
  {
    id: 'deal3',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    title: 'Daily Essentials',
    discount: 'Flat 20% OFF'
  }
];

const DealBanners = () => {
  return (
    <div className="mt-6 mb-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {dealBanners.map((deal) => (
            <CarouselItem key={deal.id} className="basis-4/5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative h-32 rounded-xl overflow-hidden"
              >
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{deal.title}</h3>
                  <span className="text-zepmeds-purple font-bold">{deal.discount}</span>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default DealBanners;
