
import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Phone, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioCallProps {
  token: string;
  channelName: string;
  consultationId: string;
  onEndCall: () => void;
  doctorName: string;
}

const AudioCall = ({ token, channelName, consultationId, onEndCall, doctorName }: AudioCallProps) => {
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [talkingDoctor, setTalkingDoctor] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const agoraClient = useRef<IAgoraRTCClient | null>(null);
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  const volumeDetectionInterval = useRef<number | null>(null);

  // Initialize Agora client
  useEffect(() => {
    agoraClient.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    
    // Setup event handlers
    agoraClient.current.on('user-published', async (user, mediaType) => {
      await agoraClient.current?.subscribe(user, mediaType);
      
      if (mediaType === 'audio') {
        user.audioTrack?.play();
        
        // Set up volume detection using an interval instead of an event listener
        if (user.audioTrack) {
          volumeDetectionInterval.current = window.setInterval(() => {
            const volume = user.audioTrack?.getVolumeLevel() || 0;
            setTalkingDoctor(volume > 0.05);
          }, 200);
        }
      }
    });

    agoraClient.current.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
        
        // Clear volume detection interval
        if (volumeDetectionInterval.current) {
          clearInterval(volumeDetectionInterval.current);
          volumeDetectionInterval.current = null;
        }
      }
    });
    
    agoraClient.current.on('user-left', user => {
      toast({
        title: "Doctor left the call",
        description: "The doctor has disconnected from the call."
      });
    });
    
    // Join channel when component mounts
    joinChannel();
    
    // Start call timer
    timerRef.current = window.setInterval(() => {
      setSeconds(prev => {
        if (prev === 59) {
          setMinutes(prevMin => prevMin + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Clean up when component unmounts
    return () => {
      leaveChannel();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (volumeDetectionInterval.current) {
        clearInterval(volumeDetectionInterval.current);
      }
    };
  }, []);

  const joinChannel = async () => {
    if (!agoraClient.current) return;
    
    try {
      // Join the channel
      await agoraClient.current.join('eaa6a3f4da604c6496a01228db55817f', channelName, token, null);
      
      // Create and publish local audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      
      await agoraClient.current.publish([audioTrack]);
      
      setIsJoined(true);
      
      toast({
        title: "Connected",
        description: "You've joined the audio consultation.",
      });
    } catch (error) {
      console.error("Error joining channel:", error);
      toast({
        title: "Connection failed",
        description: "Could not join the consultation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const leaveChannel = async () => {
    if (!agoraClient.current) return;
    
    localAudioTrack?.close();
    
    await agoraClient.current.leave();
    setIsJoined(false);
  };

  const toggleMic = async () => {
    if (localAudioTrack) {
      if (isMicOn) {
        await localAudioTrack.setEnabled(false);
      } else {
        await localAudioTrack.setEnabled(true);
      }
      setIsMicOn(!isMicOn);
    }
  };

  const handleEndCall = async () => {
    await leaveChannel();
    onEndCall();
  };

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="bg-gray-900 w-full max-w-md rounded-2xl p-6 text-center">
        <motion.div 
          animate={{ scale: talkingDoctor ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-24 h-24 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mx-auto mb-4"
        >
          <h1 className="text-3xl font-bold text-zepmeds-purple">
            {doctorName.charAt(0).toUpperCase()}
          </h1>
        </motion.div>
        
        <h2 className="text-xl font-medium text-white mb-1">{doctorName}</h2>
        <p className="text-gray-400 mb-6">Voice consultation in progress</p>
        
        <div className="text-2xl font-mono text-zepmeds-purple mb-8">
          {formattedTime}
        </div>
        
        <div className="flex justify-center gap-6">
          <Button 
            onClick={toggleMic} 
            variant={isMicOn ? "outline" : "destructive"}
            className="rounded-full h-14 w-14 p-0"
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>
          
          <Button 
            onClick={handleEndCall} 
            variant="destructive"
            className="rounded-full h-14 w-14 p-0"
          >
            <Phone size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
