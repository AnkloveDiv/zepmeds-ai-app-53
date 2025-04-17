
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VideoCall from './VideoCall';
import AudioCall from './AudioCall';
import { useToast } from '@/components/ui/use-toast';
import { Consultation } from '@/hooks/useConsultation';

interface ConsultationCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation: Consultation | null;
  token: string | null;
  doctorName: string;
  onEndCall: () => void;
}

const ConsultationCallModal = ({
  open,
  onOpenChange,
  consultation,
  token,
  doctorName,
  onEndCall
}: ConsultationCallModalProps) => {
  const { toast } = useToast();
  
  if (!consultation || !token) return null;
  
  const handleCloseAttempt = (open: boolean) => {
    if (!open) {
      // Prevent accidental close, ask for confirmation
      if (confirm('Are you sure you want to end the consultation?')) {
        onEndCall();
        onOpenChange(false);
      } else {
        onOpenChange(true); // Keep modal open
      }
    } else {
      onOpenChange(open);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleCloseAttempt}>
      <DialogContent className="bg-background border-gray-800 text-white sm:max-w-3xl h-[90vh]">
        {consultation.consultation_type === 'video' && (
          <VideoCall 
            token={token}
            channelName={consultation.room_name}
            consultationId={consultation.id}
            onEndCall={onEndCall}
          />
        )}
        
        {consultation.consultation_type === 'audio' && (
          <AudioCall 
            token={token}
            channelName={consultation.room_name}
            consultationId={consultation.id}
            onEndCall={onEndCall}
            doctorName={doctorName}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationCallModal;
