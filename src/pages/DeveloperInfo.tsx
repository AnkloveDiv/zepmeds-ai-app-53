
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Globe, Mail, Heart } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";

const DeveloperInfo = () => {
  const { ExitConfirmDialog } = useBackNavigation();
  const [developers] = useState([
    {
      id: 1,
      name: "Ankit",
      role: "Full Stack Developer",
      image: "https://source.unsplash.com/random/150x150/?portrait",
      description: "Senior developer with 5+ years of experience in React and Node.js",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
      email: "ankit@example.com"
    },
    {
      id: 2,
      name: "Shivanshu",
      role: "UI/UX Designer",
      image: "https://source.unsplash.com/random/150x150/?man",
      description: "Creative designer with expertise in mobile app interfaces",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
      email: "shivanshu@example.com"
    },
    {
      id: 3,
      name: "Shivam Kumar Singla",
      role: "Backend Developer",
      image: "https://source.unsplash.com/random/150x150/?man",
      description: "Specialized in database architecture and API development",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
      email: "shivam@example.com"
    }
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="About Developers" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-2">About the App</h2>
          <p className="text-gray-300 mb-4">
            Zepmeds is a comprehensive healthcare platform designed to simplify medicine delivery
            and provide easy access to healthcare services. Our mission is to make healthcare
            accessible to everyone.
          </p>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Version 1.0.0</span>
            <span>© 2025 Zepmeds</span>
          </div>
        </motion.div>
        
        <h2 className="text-xl font-bold text-white mb-4">Meet the Team</h2>
        
        <div className="space-y-4">
          {developers.map((developer, index) => (
            <motion.div
              key={developer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism rounded-xl p-4"
            >
              <div className="flex items-center mb-4">
                <div className="relative mr-4">
                  <img 
                    src={developer.image} 
                    alt={developer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-zepmeds-purple"
                  />
                </div>
                
                <div>
                  <h3 className="text-white font-medium">{developer.name}</h3>
                  <p className="text-zepmeds-purple text-sm">{developer.role}</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{developer.description}</p>
              
              <div className="flex space-x-3">
                <a href={developer.github} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-gray-300 hover:bg-zepmeds-purple/20 hover:text-zepmeds-purple transition-colors">
                  <Github className="h-4 w-4" />
                </a>
                <a href={developer.linkedin} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-gray-300 hover:bg-zepmeds-purple/20 hover:text-zepmeds-purple transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={developer.website} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-gray-300 hover:bg-zepmeds-purple/20 hover:text-zepmeds-purple transition-colors">
                  <Globe className="h-4 w-4" />
                </a>
                <a href={`mailto:${developer.email}`} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-gray-300 hover:bg-zepmeds-purple/20 hover:text-zepmeds-purple transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in India
          </p>
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default DeveloperInfo;
