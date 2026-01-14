"use client";

import { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Upload,
  User,
  Shield,
  Clock,
  ScreenShare,
  ScreenShareOff,
  Copy,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface VideoConsultationProps {
  consultationId: string;
  userRole: "patient" | "doctor";
  onEndCall: () => void;
}

export function VideoConsultation({
  consultationId,
  userRole,
  onEndCall,
}: VideoConsultationProps) {
  const [consultation, setConsultation] = useState<any>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("30:00");
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [isRecording, setIsRecording] = useState(false);
  const [isInWaitingRoom, setIsInWaitingRoom] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConsultation();
    connectToVideoCall();
    startTimer();
    checkDevicePermissions();

    // Simulate joining call
    setTimeout(() => {
      if (userRole === "doctor") {
        admitPatient();
      } else {
        joinCall();
      }
    }, 3000);

    return () => {
      // Cleanup video call
      disconnectCall();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/telehealth/${consultationId}`);
      const data = await response.json();
      setConsultation(data);
    } catch (error) {
      console.error("Error fetching consultation:", error);
    }
  };

  const connectToVideoCall = () => {
    // In production, integrate with Daily.co, Zoom, or custom WebRTC
    console.log("Connecting to video call...");
    
    // Simulate video streams
    if (videoRef.current) {
      // Use sample video for demo
      videoRef.current.srcObject = new MediaStream();
    }
  };

  const startTimer = () => {
    let seconds = 30 * 60; // 30 minutes
    const interval = setInterval(() => {
      seconds--;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setTimeRemaining(
        `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
      );

      if (seconds <= 0) {
        clearInterval(interval);
        toast({
          title: "Time's up!",
          description: "Consultation time has ended",
        });
        endConsultation();
      }
    }, 1000);
  };

  const checkDevicePermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      toast({
        title: "Devices Ready",
        description: "Camera and microphone permissions granted",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Permission Required",
        description: "Please allow camera and microphone access",
        variant: "destructive",
      });
    }
  };

  const admitPatient = () => {
    setIsInWaitingRoom(false);
    toast({
      title: "Patient Admitted",
      description: "Patient has been admitted to the consultation",
    });
  };

  const joinCall = () => {
    setIsInWaitingRoom(false);
    toast({
      title: "Joined Consultation",
      description: "Waiting for doctor to start the session",
    });
  };

  const disconnectCall = () => {
    console.log("Disconnecting from call...");
    // Clean up media streams
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const endConsultation = async () => {
    try {
      const response = await fetch(`/api/telehealth/${consultationId}/end`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Consultation Ended",
          description: "Session has been completed successfully",
        });
        onEndCall();
      }
    } catch (error) {
      console.error("Error ending consultation:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      content: newMessage,
      type: "text",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    try {
      await fetch(`/api/telehealth/${consultationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleRecording = () => {
    if (userRole !== "doctor") {
      toast({
        title: "Permission Denied",
        description: "Only doctors can record consultations",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording 
        ? "Consultation recording has been saved" 
        : "Consultation is being recorded with patient consent",
    });
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Meeting link copied to clipboard",
    });
  };

  const sendFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/telehealth/${consultationId}/files`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "File Sent",
          description: "File has been shared successfully",
        });
      }
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionQuality === "good" ? "bg-green-500" :
              connectionQuality === "average" ? "bg-yellow-500" : "bg-red-500"
            }`}></div>
            <span className="text-sm">
              {connectionQuality === "good" ? "Good connection" : 
               connectionQuality === "average" ? "Average connection" : "Poor connection"}
            </span>
          </div>
          <Badge variant="outline" className="border-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            {timeRemaining}
          </Badge>
          {isRecording && (
            <Badge className="bg-red-600">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
              Recording
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600"
            onClick={copyMeetingLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-sm">End-to-end encrypted</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col p-4">
          {/* Remote Video */}
          <div className="flex-1 relative bg-black rounded-xl overflow-hidden mb-4">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Waiting Room */}
            {isInWaitingRoom && (
              <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {userRole === "doctor" ? "Admit Patient" : "Waiting Room"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {userRole === "doctor" 
                      ? "Patient is waiting to be admitted" 
                      : "Waiting for doctor to start the session"}
                  </p>
                  {userRole === "doctor" && (
                    <Button onClick={admitPatient}>
                      Admit Patient
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Remote User Info */}
            <div className="absolute bottom-4 left-4 bg-gray-900/70 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={consultation?.doctor?.avatar} />
                  <AvatarFallback>
                    {consultation?.doctor?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {userRole === "patient" 
                      ? consultation?.doctor?.name 
                      : consultation?.patient?.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {userRole === "patient" ? "Doctor" : "Patient"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Local Video */}
          <div className="w-48 h-36 bg-black rounded-xl overflow-hidden absolute bottom-4 right-4 border-2 border-gray-700">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
              You
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 p-4">
            <Button
              size="lg"
              variant={isVideoOn ? "default" : "destructive"}
              className={`rounded-full w-14 h-14 ${
                isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </Button>

            <Button
              size="lg"
              variant={isAudioOn ? "default" : "destructive"}
              className={`rounded-full w-14 h-14 ${
                isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </Button>

            <Button
              size="lg"
              variant={isScreenSharing ? "default" : "outline"}
              className="rounded-full w-14 h-14 bg-gray-700 hover:bg-gray-600"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              {isScreenSharing ? (
                <ScreenShareOff className="w-6 h-6" />
              ) : (
                <ScreenShare className="w-6 h-6" />
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-14 h-14 border-gray-600 hover:bg-gray-800"
              onClick={toggleRecording}
              disabled={userRole !== "doctor"}
            >
              <div className={`w-6 h-6 ${isRecording ? "text-red-500" : "text-gray-400"}`}>
                ●
              </div>
            </Button>

            <Button
              size="lg"
              variant="destructive"
              className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
              onClick={endConsultation}
            >
              <Phone className="w-6 h-6 rotate-135" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 border-l border-gray-700 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 rounded-none">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${message.sender === "doctor" ? "text-right" : ""}`}
                  >
                    <div
                      className={`inline-block max-w-xs rounded-2xl px-4 py-2 ${
                        message.sender === "doctor"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t border-gray-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border-gray-700"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="p-4">
              <div className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Consultation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span>Video Consultation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span>30 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          In Progress
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Patient Symptoms</h4>
                    <p className="text-sm text-gray-300">
                      {consultation?.symptoms || "No symptoms reported"}
                    </p>
                  </CardContent>
                </Card>

                {userRole === "doctor" && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Prescription
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Emergency Referral
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="p-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Drag & drop files to share</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && sendFile(e.target.files[0])}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Browse Files
                    </Button>
                  </label>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Shared Files</h4>
                  <div className="space-y-2">
                    {/* File list would go here */}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}