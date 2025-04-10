
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneIcon, Globe, Download, Github, Code } from "lucide-react";

const AppGuide = () => {
  const [activeTab, setActiveTab] = useState("pwa");

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="App Development Guide" />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-5 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Make ZepMeds a Mobile App</h2>
          <p className="text-gray-300 mb-4">
            ZepMeds can be transformed into a mobile application through several approaches.
            Choose the method that best fits your requirements.
          </p>
          
          <Tabs defaultValue="pwa" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="pwa">PWA</TabsTrigger>
              <TabsTrigger value="native">Native App</TabsTrigger>
              <TabsTrigger value="hybrid">Hybrid App</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pwa" className="space-y-4">
              <div className="glass-morphism rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Globe className="h-6 w-6 text-zepmeds-purple mr-2" />
                  <h3 className="text-lg font-medium text-white">Progressive Web App (PWA)</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  The easiest approach is to convert this React application into a Progressive Web App (PWA),
                  which allows users to install it on their devices directly from the browser.
                </p>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-2 ml-2">
                  <li>Add a web manifest file (manifest.json)</li>
                  <li>Register a service worker for offline capabilities</li>
                  <li>Add appropriate icons for different device sizes</li>
                  <li>Implement caching strategies for assets and API responses</li>
                </ol>
                <Button className="mt-4 bg-zepmeds-purple hover:bg-zepmeds-purple/80">
                  <Download className="h-4 w-4 mr-2" />
                  Setup PWA Configuration
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="native" className="space-y-4">
              <div className="glass-morphism rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <PhoneIcon className="h-6 w-6 text-zepmeds-purple mr-2" />
                  <h3 className="text-lg font-medium text-white">Native Mobile App</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  For the best performance and access to device features, you can build native mobile apps
                  for iOS and Android using React Native.
                </p>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-2 ml-2">
                  <li>Port the existing React components to React Native</li>
                  <li>Replace web-specific libraries with mobile alternatives</li>
                  <li>Setup navigation using React Navigation</li>
                  <li>Configure native builds for iOS and Android</li>
                  <li>Implement push notifications and deep linking</li>
                </ol>
                <Button className="mt-4 bg-zepmeds-purple hover:bg-zepmeds-purple/80">
                  <Github className="h-4 w-4 mr-2" />
                  Get React Native Template
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hybrid" className="space-y-4">
              <div className="glass-morphism rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Code className="h-6 w-6 text-zepmeds-purple mr-2" />
                  <h3 className="text-lg font-medium text-white">Hybrid App Approach</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Use tools like Capacitor or Cordova to wrap the existing web application
                  in a native container without completely rewriting it.
                </p>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-2 ml-2">
                  <li>Install Capacitor in your project</li>
                  <li>Configure the app settings and permissions</li>
                  <li>Add native plugins for features like camera, geolocation, etc.</li>
                  <li>Build for iOS and Android</li>
                  <li>Deploy to respective app stores</li>
                </ol>
                <div className="bg-black/30 rounded p-3 mt-4 text-sm text-gray-300">
                  <pre>
                    # Install Capacitor{"\n"}
                    npm install @capacitor/core @capacitor/cli{"\n"}
                    npx cap init{"\n\n"}
                    # Add platforms{"\n"}
                    npx cap add android{"\n"}
                    npx cap add ios
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <div className="glass-morphism rounded-xl p-5">
          <h3 className="text-xl font-bold text-white mb-3">App Distribution Options</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-zepmeds-purple/20 p-2 rounded-full mt-1 mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16H11V18H13V16Z" fill="#9b87f5"/>
                  <path d="M13 6H11V14H13V6Z" fill="#9b87f5"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#9b87f5"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium">App Stores</h4>
                <p className="text-gray-300 text-sm">
                  Submit native or hybrid apps to Apple App Store and Google Play Store for wider distribution.
                  Requires developer accounts and may involve review processes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-zepmeds-purple/20 p-2 rounded-full mt-1 mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM18 12H6V10H18V12ZM14 16H6V14H14V16Z" fill="#9b87f5"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium">Enterprise Distribution</h4>
                <p className="text-gray-300 text-sm">
                  For internal company use, distribute through enterprise programs like Apple Business Manager 
                  or Android Enterprise without public app store listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppGuide;
