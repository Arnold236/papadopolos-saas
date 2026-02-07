"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  MessageSquare,
  FileText,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Stethoscope,
  CreditCard,
  Mail,
  MessageSquare as Chat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import Link from "next/link";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";
  reason: string;
  notes?: string;
  type: "IN_PERSON" | "TELEHEALTH_VIDEO" | "TELEHEALTH_AUDIO" | "TELEHEALTH_CHAT";
  consultationFee: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  attended: boolean;
  followUpNeeded: boolean;
  followUpDate?: string;
  
  patient: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  
  doctor: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      phone?: string;
    };
    specialty: string;
    qualifications: string[];
    experience: number;
    consultationFee: number;
    bio?: string;
  };
  
  telehealthConsultation?: {
    id: string;
    meetingUrl: string;
    meetingId: string;
    meetingPassword?: string;
    status: string;
  };
  
  prescription?: {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    prescribedAt: string;
  };
  
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: string;
  }>;
}

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isLoaded && !user) {
      router.push(`/sign-in?redirect=/appointments/${params.id}`);
      return;
    }

    if (user) {
      fetchAppointment();
    }
  }, [isLoaded, user, router, params.id]);

  const fetchAppointment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/appointments/${params.id}`);
      if (response.status === "")
      {

      }
    }}