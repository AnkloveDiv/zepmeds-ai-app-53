
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Report {
  id: string;
  title: string;
  date: string;
  doctor: string;
  type: string;
  previewUrl: string;
  downloadUrl: string;
}

const MedicalReports = () => {
  useBackNavigation();
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: "rep1",
      title: "Blood Test Report",
      date: "April 2, 2025",
      doctor: "Dr. Sharma",
      type: "Pathology",
      previewUrl: "#",
      downloadUrl: "#"
    },
    {
      id: "rep2",
      title: "Chest X-Ray",
      date: "March 15, 2025",
      doctor: "Dr. Patel",
      type: "Radiology",
      previewUrl: "#",
      downloadUrl: "#"
    },
    {
      id: "rep3",
      title: "ECG Report",
      date: "February 18, 2025",
      doctor: "Dr. Singh",
      type: "Cardiology",
      previewUrl: "#",
      downloadUrl: "#"
    },
    {
      id: "rep4",
      title: "Dental Checkup",
      date: "January 5, 2025",
      doctor: "Dr. Kumar",
      type: "Dental",
      previewUrl: "#",
      downloadUrl: "#"
    },
    {
      id: "rep5",
      title: "Allergy Test Report",
      date: "December 10, 2024",
      doctor: "Dr. Gupta",
      type: "Immunology",
      previewUrl: "#",
      downloadUrl: "#"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<string>("All");
  
  // Filter options
  const filters = ["All", "Recent", "Pathology", "Radiology", "Cardiology", "Dental"];
  
  const filteredReports = activeFilter === "All" 
    ? reports 
    : activeFilter === "Recent" 
      ? reports.slice(0, 3) 
      : reports.filter(report => report.type === activeFilter);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medical Reports" />
      
      <main className="px-4 py-6">
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    filter === activeFilter
                      ? "bg-zepmeds-purple text-white"
                      : "bg-black/20 border border-white/10 text-gray-300"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/20 border border-white/10 hover:border-zepmeds-purple/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-4">
                        <FileText className="h-6 w-6 text-zepmeds-purple" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{report.title}</h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{report.date}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Doctor: {report.doctor}</p>
                        
                        <div className="flex mt-3 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-black/20 border-white/10 hover:bg-zepmeds-purple/10 hover:border-zepmeds-purple/30 text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-black/20 border-white/10 hover:bg-zepmeds-purple/10 hover:border-zepmeds-purple/30 text-white"
                          >
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="px-2 py-1 rounded-full bg-black/30 text-xs text-white">
                        {report.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-white mb-2">No reports found</h3>
              <p className="text-gray-400 mb-6">No medical reports in this category</p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default MedicalReports;
