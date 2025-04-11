
import React from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import { Github, Linkedin, Globe, Mail, User, Code, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import useBackNavigation from "@/hooks/useBackNavigation";

const DeveloperInfo = () => {
  // Use back navigation hook
  useBackNavigation();
  
  const developers = [
    {
      name: "Ankit",
      role: "Frontend Developer",
      description: "Specializes in React and mobile responsive design",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      links: {
        github: "https://github.com/ankit",
        linkedin: "https://linkedin.com/in/ankit",
        website: "https://ankit.dev",
        email: "ankit@zepmeds.com"
      }
    },
    {
      name: "Shivanshu",
      role: "Backend Engineer",
      description: "Expert in API architecture and database optimization",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      links: {
        github: "https://github.com/shivanshu",
        linkedin: "https://linkedin.com/in/shivanshu",
        website: "https://shivanshu.dev",
        email: "shivanshu@zepmeds.com"
      }
    },
    {
      name: "Shivam Kumar Singla",
      role: "UI/UX Designer",
      description: "Focused on creating seamless user experiences",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      links: {
        github: "https://github.com/shivamsingla",
        linkedin: "https://linkedin.com/in/shivamsingla",
        website: "https://shivamsingla.com",
        email: "shivam@zepmeds.com"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="About Developers" />

      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <div className="flex items-center mb-4">
            <Code className="h-5 w-5 text-zepmeds-purple mr-2" />
            <h2 className="text-lg font-medium text-white">Meet the Team</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Zepmeds is built by a passionate team dedicated to revolutionizing medicine
            delivery in India. We combine expertise in development, design, and healthcare
            to deliver a seamless experience.
          </p>

          <div className="flex items-center mt-4 p-3 bg-black/20 rounded-lg">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            <p className="text-xs text-gray-300">
              Our mission is to make healthcare more accessible through technology
            </p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {developers.map((dev, index) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-morphism rounded-xl p-4"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{dev.name}</h3>
                  <p className="text-zepmeds-purple text-sm">{dev.role}</p>
                  <p className="text-gray-400 text-xs mt-1">{dev.description}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <a
                  href={dev.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={18} />
                </a>
                <a
                  href={dev.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={dev.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe size={18} />
                </a>
                <a
                  href={`mailto:${dev.links.email}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 glass-morphism rounded-xl p-4"
        >
          <h3 className="text-white font-medium mb-2 flex items-center">
            <User className="h-4 w-4 text-zepmeds-purple mr-2" />
            Join Our Team
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Passionate about healthcare technology? We're always looking for talented
            individuals to join our team.
          </p>
          <Button className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90">
            View Open Positions
          </Button>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default DeveloperInfo;
