
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export interface Consultation {
  id: string;
  doctor_id: string;
  consultation_type: 'video' | 'audio' | 'chat';
  status: 'booked' | 'in_progress' | 'completed' | 'cancelled';
  room_name: string;
  started_at: string | null;
  ended_at: string | null;
}

export const useConsultation = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [agoraToken, setAgoraToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();

    // Subscribe to changes in consultations
    const channel = supabase
      .channel('public:doctor_consultations')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'doctor_consultations' 
      }, payload => {
        console.log('Consultation updated:', payload);
        fetchConsultations();
        
        // If doctor ended the call while we're in a consultation
        if (currentConsultation && 
            payload.new && 
            payload.old &&
            payload.new.id === currentConsultation.id && 
            payload.new.status === 'completed' &&
            payload.old.status === 'in_progress') {
          toast({
            title: "Call Ended",
            description: "Doctor has ended the consultation.",
            variant: "default"
          });
          navigate('/doctor');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConsultation]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor_consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data to the Consultation type
      setConsultations((data || []) as Consultation[]);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Error",
        description: "Failed to load consultation data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const bookConsultation = async (doctorId: string, consultationType: 'video' | 'audio' | 'chat') => {
    try {
      setLoading(true);
      const roomName = `consultation-${Date.now()}`;
      
      // Get current user ID from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('doctor_consultations')
        .insert({
          user_id: user.id,
          doctor_id: doctorId,
          consultation_type: consultationType,
          status: 'booked',
          room_name: roomName
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Consultation Booked",
        description: `Your ${consultationType} consultation has been booked successfully.`,
      });
      
      return data as Consultation;
    } catch (error) {
      console.error('Error booking consultation:', error);
      toast({
        title: "Booking Failed",
        description: "Could not book consultation. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async (consultationId: string) => {
    try {
      setLoading(true);
      
      // Get consultation details
      const { data: consultation, error: consultationError } = await supabase
        .from('doctor_consultations')
        .select('*')
        .eq('id', consultationId)
        .single();
        
      if (consultationError) {
        throw consultationError;
      }
      
      // Update consultation status to in_progress
      const { error: updateError } = await supabase
        .from('doctor_consultations')
        .update({ 
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', consultationId);
        
      if (updateError) {
        throw updateError;
      }
      
      // Generate Agora token
      const response = await supabase.functions.invoke('generate-agora-token', {
        body: { 
          channelName: consultation.room_name,
          uid: Date.now().toString(),
          role: 'publisher'
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCurrentConsultation(consultation as Consultation);
      setAgoraToken(response.data.token);
      
      return {
        consultation: consultation as Consultation,
        token: response.data.token
      };
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast({
        title: "Error",
        description: "Failed to start consultation",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const endConsultation = async (consultationId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('doctor_consultations')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', consultationId);
        
      if (error) {
        throw error;
      }
      
      setCurrentConsultation(null);
      setAgoraToken(null);
      
      toast({
        title: "Consultation Ended",
        description: "Your consultation has ended.",
      });
      
      return true;
    } catch (error) {
      console.error('Error ending consultation:', error);
      toast({
        title: "Error",
        description: "Failed to end consultation",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    consultations,
    loading,
    currentConsultation,
    agoraToken,
    bookConsultation,
    startConsultation,
    endConsultation,
    fetchConsultations
  };
};
