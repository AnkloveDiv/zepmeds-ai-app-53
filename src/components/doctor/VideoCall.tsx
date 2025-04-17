
import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Phone, Video, VideoOff, Mic, MicOff, MonitorOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCallProps {
  token: string;
  channelName: string;
  consultationId: string;
  onEndCall: () => void;
}

const VideoCall = ({ token, channelName, consultationId, onEndCall }: VideoCallProps) => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const agoraClient = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize Agora client
  useEffect(() => {
    agoraClient.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    
    // Setup event handlers
    agoraClient.current.on('user-published', async (user, mediaType) => {
      await agoraClient.current?.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => {
          if (prevUsers.every(u => u.uid !== user.uid)) {
            return [...prevUsers, user];
          }
          return prevUsers;
        });
        
        if (user.videoTrack && remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current);
        }
      }
      
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    agoraClient.current.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      }
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
      }
    });
    
    agoraClient.current.on('user-left', user => {
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      toast({
        title: "Doctor left the call",
        description: "The doctor has disconnected from the call."
      });
    });
    
    // Join channel when component mounts
    joinChannel();
    
    // Clean up when component unmounts
    return () => {
      leaveChannel();
    };
  }, []);

  const joinChannel = async () => {
    if (!agoraClient.current) return;
    
    try {
      // Join the channel
      await agoraClient.current.join('eaa6a3f4da604c6496a01228db55817f', channelName, token, null);
      
      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      await agoraClient.current.publish([audioTrack, videoTrack]);
      
      if (localVideoRef.current && videoTrack) {
        videoTrack.play(localVideoRef.current);
      }
      
      setIsJoined(true);
      
      toast({
        title: "Connected",
        description: "You've joined the consultation.",
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
    localVideoTrack?.close();
    
    await agoraClient.current.leave();
    setRemoteUsers([]);
    setIsJoined(false);
  };

  const toggleCamera = async () => {
    if (localVideoTrack) {
      if (isCameraOn) {
        await localVideoTrack.setEnabled(false);
      } else {
        await localVideoTrack.setEnabled(true);
      }
      setIsCameraOn(!isCameraOn);
    }
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

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 bg-black relative overflow-hidden rounded-lg">
        {/* Remote user video (doctor) - large display */}
        <div 
          ref={remoteVideoRef} 
          className="h-full w-full bg-gray-900 flex items-center justify-center"
        >
          {remoteUsers.length === 0 && (
            <div className="text-white text-center">
              <div className="w-24 h-24 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mx-auto mb-4">
                <Video size={48} className="text-zepmeds-purple" />
              </div>
              <p>Waiting for doctor to join...</p>
            </div>
          )}
        </div>
        
        {/* Local user video - small overlay */}
        <motion.div 
          ref={localVideoRef}
          className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-white bg-gray-800"
          drag
          dragConstraints={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {!isCameraOn && (
            <div className="h-full w-full flex items-center justify-center bg-gray-800">
              <VideoOff size={24} className="text-white" />
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Controls */}
      <div className="mt-4 flex justify-center gap-4">
        <Button 
          onClick={toggleMic} 
          variant={isMicOn ? "outline" : "destructive"}
          className="rounded-full h-12 w-12 p-0"
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>
        
        <Button 
          onClick={handleEndCall} 
          variant="destructive"
          className="rounded-full h-12 w-12 p-0"
        >
          <Phone size={20} />
        </Button>
        
        <Button 
          onClick={toggleCamera} 
          variant={isCameraOn ? "outline" : "destructive"}
          className="rounded-full h-12 w-12 p-0"
        >
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
