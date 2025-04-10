
import { ShoppingBag } from "lucide-react";

const OfferBanner = () => {
  return (
    <section className="mt-8">
      <div className="glass-morphism rounded-xl p-4">
        <div className="flex items-center">
          <div className="mr-4 p-3 rounded-full bg-zepmeds-purple-transparent">
            <ShoppingBag className="h-6 w-6 text-zepmeds-purple" />
          </div>
          <div>
            <h3 className="text-white font-medium">Exclusive Offer</h3>
            <p className="text-gray-400 text-sm">Use code ZEPMEDS for 20% off</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
