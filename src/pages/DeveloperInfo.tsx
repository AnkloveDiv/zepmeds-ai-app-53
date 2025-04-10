import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Globe, Code, Heart } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";

interface DeveloperProfile {
  name: string;
  role: string;
  bio: string;
  image: string;
  github?: string;
  linkedin?: string;
  email?: string;
  website?: string;
  skills: string[];
}

const DeveloperInfo = () => {
  useBackNavigation();
  
  const developers: DeveloperProfile[] = [
    {
      name: "Ankit",
      role: "Lead Developer",
      bio: "Passionate about creating user-friendly healthcare applications. Specialist in frontend development with React and building responsive mobile interfaces.",
      image: "https://avatars.githubusercontent.com/u/12345678",
      github: "https://github.com/ankit",
      linkedin: "https://linkedin.com/in/ankit",
      email: "ankit@example.com",
      skills: ["React", "TypeScript", "UI/UX Design", "Mobile Development"]
    },
    {
      name: "Shivanshu",
      role: "Backend Developer",
      bio: "Expert in building secure and scalable healthcare APIs. Focused on data privacy and performance optimization for medical applications.",
      image: "https://avatars.githubusercontent.com/u/87654321",
      github: "https://github.com/shivanshu",
      linkedin: "https://linkedin.com/in/shivanshu",
      email: "shivanshu@example.com",
      skills: ["Node.js", "Database Design", "API Development", "Security"]
    },
    {
      name: "Shivam Kumar Singla",
      role: "Full Stack Developer",
      bio: "Experienced in developing end-to-end healthcare solutions. Specializes in creating seamless user experiences from frontend to backend.",
      image: "https://avatars.githubusercontent.com/u/23456789",
      github: "https://github.com/shivamsingla",
      linkedin: "https://linkedin.com/in/shivamsingla",
      website: "https://shivamsingla.dev",
      email: "shivam@example.com",
      skills: ["Full Stack", "React", "Node.js", "Cloud Infrastructure"]
    }
  ];

  const staggerDuration = 0.1;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="About Developers" />

      <main className="px-4 py-4">
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-xl p-5 mb-6"
          >
            <h2 className="text-xl font-bold text-white mb-3 flex items-center">
              <Code className="h-5 w-5 mr-2 text-zepmeds-purple" />
              Zepmeds Development Team
            </h2>
            <p className="text-gray-300 text-sm">
              Meet the talented developers behind Zepmeds - the Digital Rx Hub application. Our team is passionate about healthcare technology and creating solutions that make accessing medicines and medical consultations easier for everyone.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {developers.map((developer, index) => (
              <motion.div
                key={developer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * staggerDuration }}
                className="glass-morphism rounded-xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-zepmeds-purple/20 flex items-center justify-center text-2xl font-bold text-white mr-4">
                      {developer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{developer.name}</h3>
                      <p className="text-zepmeds-purple text-sm">{developer.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{developer.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold text-sm mb-2">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {developer.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="text-xs bg-zepmeds-purple/20 text-zepmeds-purple px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {developer.github && (
                      <a 
                        href={developer.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/50 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    
                    {developer.linkedin && (
                      <a 
                        href={developer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/50 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    
                    {developer.email && (
                      <a 
                        href={`mailto:${developer.email}`}
                        className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/50 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    
                    {developer.website && (
                      <a 
                        href={developer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/50 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-gray-400 text-sm flex items-center justify-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by Ankit, Shivanshu & Shivam Kumar Singla
          </p>
          <p className="text-gray-500 text-xs mt-1">© 2023 Zepmeds Digital Rx Hub. All rights reserved.</p>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default DeveloperInfo;
