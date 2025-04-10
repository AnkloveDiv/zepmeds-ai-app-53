
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface AdvertisementModalProps {
  image: string;
  title: string;
  sponsor: string;
  url?: string;
  onClose: () => void;
}

const AdvertisementModal = ({ 
  image, 
  title, 
  sponsor, 
  url = "#", 
  onClose 
}: AdvertisementModalProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    onClick={onClose}
  >
    <div className="relative max-w-md w-full overflow-hidden rounded-xl" onClick={e => e.stopPropagation()}>
      <button 
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white"
        onClick={onClose}
      >
        ✕
      </button>
      
      <div className="relative">
        <img src={image} alt={title} className="w-full" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-bold">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-300 text-xs">Sponsored by {sponsor}</span>
            <a 
              href={url} 
              className="text-zepmeds-purple text-sm flex items-center"
              onClick={e => e.stopPropagation()}
            >
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default AdvertisementModal;
