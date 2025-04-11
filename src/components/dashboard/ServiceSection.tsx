
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ServiceCard from "@/components/ServiceCard";
import { Pill, FileUp, MessageSquareText, Stethoscope, Dog, Package } from "lucide-react";

const ServiceSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Medicine Delivery",
      description: "Order medicines online",
      icon: <Pill className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-400",
      onClick: () => navigate("/medicine-delivery")
    },
    {
      title: "Upload Prescription",
      description: "Get medicines as prescribed",
      icon: <FileUp className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-purple-600 to-purple-400",
      onClick: () => navigate("/prescription-upload")
    },
    {
      title: "AI Symptom Checker",
      description: "Get instant health insights",
      icon: <MessageSquareText className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-green-600 to-green-400",
      onClick: () => navigate("/symptom-checker")
    },
    {
      title: "Consult Doctor",
      description: "Online consultation",
      icon: <Stethoscope className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-red-600 to-red-400",
      onClick: () => navigate("/doctor")
    },
    {
      title: "Pet Care",
      description: "Medicines & vet consult",
      icon: <Dog className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-amber-600 to-amber-400",
      onClick: () => navigate("/medicine-delivery?category=petcare")
    },
    {
      title: "Track Order",
      description: "Real-time delivery status",
      icon: <Package className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-teal-600 to-teal-400",
      onClick: () => navigate("/order-tracking")
    }
  ];

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <ServiceCard
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              onClick={service.onClick}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;
