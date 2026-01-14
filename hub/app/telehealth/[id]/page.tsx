"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { VideoConsultation } from "@/components/telehealth/VideoConsultation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TelehealthRoomPage({ params }: { params: { id: string } }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);
  const [userRole, setUserRole] = useState<"patient" | "doctor" | null>(null);
  const [requirements, setRequirements] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in?redirect=/telehealth");
      return;
    }

    checkRequirements();
    fetchConsultation();
  }, [isLoaded, user, router]);

  const checkRequirements = () => {
    const checks = {
      camera: false,
      microphone: false,
      internet: navigator.onLine,
      browser: window.location.protocol === "https:" && "RTCPeerConnection" in window,
    };

    // Check media devices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => { checks.camera = true; })
        .catch(() => { checks.camera = false; });
      
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => { checks.microphone = true; })
        .catch(() => { checks.microphone = false; });
    }

    setRequirements(checks);
  };

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/telehealth/${params.id}`);
      const data = await response.json();
      setConsultation(data);

      // Determine user role
      if (user) {
        const userDb = await fetch(`/api/users/${user.id}`);
        const userData = await userDb.json();
        
        if (userData.id === data.patientId) {
          setUserRole("patient");
        } else if (userData.id === data.doctorId) {
          setUserRole("doctor");
        }
      }
    } catch (error) {
      console.error("Error fetching consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    router.push("/dashboard/telehealth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00BFFF] mx-auto mb-4" />
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    );
  }

  if (!consultation || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Consultation Not Found</h3>
            <p className="text-gray-600 mb-4">
              This consultation does not exist or you don't have access to it.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if consultation can start
  const now = new Date();
  const startTime = new Date(consultation.scheduledAt);
  const canStart = now >= startTime || userRole === "doctor";

  if (!canStart) {
    const timeUntil = Math.max(0, startTime.getTime() - now.getTime());
    const minutesUntil = Math.ceil(timeUntil / (1000 * 60));

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-3xl">🕐</div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Consultation Starts Soon</h3>
            <p className="text-gray-600 mb-4">
              Your telehealth consultation will begin in {minutesUntil} minutes
            </p>
            <div className="space-y-4">
              <div className="text-left bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Preparation Checklist</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${requirements?.camera ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Camera {requirements?.camera ? 'Ready' : 'Not Detected'}
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${requirements?.microphone ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Microphone {requirements?.microphone ? 'Ready' : 'Not Detected'}
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${requirements?.internet ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Internet Connection
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => router.push(`/telehealth/${params.id}`)}
                className="w-full"
              >
                Join Now (Early Access)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <VideoConsultation
      consultationId={params.id}
      userRole={userRole}
      onEndCall={handleEndCall}
    />
  );
}