"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Video,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isTomorrow, addMinutes } from "date-fns";
import Link from "next/link";

export default function TelehealthDashboardPage() {
  const { user } = useUser();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConsultations();
    }
  }, [user]);

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/telehealth/consultations");
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingConsultations = consultations.filter(
    (c) => new Date(c.scheduledAt) >= new Date()
  ).slice(0, 3);

  const pastConsultations = consultations.filter(
    (c) => new Date(c.scheduledAt) < new Date()
  ).slice(0, 5);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
      IN_PROGRESS: { label: "In Progress", color: "bg-green-100 text-green-800" },
      COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-800" },
      CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      NO_SHOW: { label: "No Show", color: "bg-yellow-100 text-yellow-800" },
    };
    const config = variants[status] || { label: status, color: "bg-gray-100" };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-4 h-4" />;
      case "AUDIO":
        return <Phone className="w-4 h-4" />;
      case "CHAT":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const formatConsultationTime = (date: string) => {
    const consultationDate = new Date(date);
    if (isToday(consultationDate)) {
      return `Today at ${format(consultationDate, "h:mm a")}`;
    } else if (isTomorrow(consultationDate)) {
      return `Tomorrow at ${format(consultationDate, "h:mm a")}`;
    } else {
      return format(consultationDate, "MMM d, yyyy 'at' h:mm a");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Telehealth Consultations</h1>
              <p className="text-gray-600">Manage your virtual healthcare appointments</p>
            </div>
            <Link href="/telehealth/book">
              <Button className="bg-[#00BFFF] hover:bg-[#0099CC]">
                <Video className="w-4 h-4 mr-2" />
                New Consultation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold">
                    {consultations.filter(c => c.status === "SCHEDULED").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {consultations.filter(c => c.status === "COMPLETED").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold">
                    {consultations.filter(c => c.status === "CANCELLED").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold">
                    {consultations
                      .filter(c => c.status === "COMPLETED")
                      .reduce((acc, c) => acc + (c.duration || 30), 0)} min
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Consultations</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <Card>
                  <CardContent className="pt-6">
                    {upcomingConsultations.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingConsultations.map((consultation) => (
                          <div
                            key={consultation.id}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar>
                                  <AvatarImage src={consultation.doctor?.avatar} />
                                  <AvatarFallback>
                                    {consultation.doctor?.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{consultation.doctor?.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {consultation.doctor?.specialty}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                      {getTypeIcon(consultation.type)}
                                      <span className="ml-2">
                                        {consultation.type.toLowerCase()} • {consultation.duration} min
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>{formatConsultationTime(consultation.scheduledAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(consultation.status)}
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    Reschedule
                                  </Button>
                                  <Link href={`/telehealth/${consultation.id}`}>
                                    <Button size="sm" className="bg-[#00BFFF] hover:bg-[#0099CC]">
                                      Join Now
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No upcoming consultations</h3>
                        <p className="text-gray-600 mb-4">
                          Schedule your first telehealth consultation
                        </p>
                        <Link href="/telehealth/book">
                          <Button>Book Consultation</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="past">
                <Card>
                  <CardContent className="pt-6">
                    {/* Past consultations list */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="w-4 h-4 mr-2" />
                    Test Video/Audio
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download App
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Meeting Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Consultation */}
            {upcomingConsultations[0] && (
              <Card className="bg-gradient-to-br from-[#00BFFF] to-[#0099CC] text-white">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Next Consultation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={upcomingConsultations[0].doctor?.avatar} />
                        <AvatarFallback>
                          {upcomingConsultations[0].doctor?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold">{upcomingConsultations[0].doctor?.name}</h4>
                        <p className="text-sm opacity-90">
                          {upcomingConsultations[0].doctor?.specialty}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatConsultationTime(upcomingConsultations[0].scheduledAt)}</span>
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(upcomingConsultations[0].type)}
                        <span className="ml-2">
                          {upcomingConsultations[0].type.toLowerCase()} consultation
                        </span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-white text-[#00BFFF] hover:bg-gray-100">
                      Join 15 Minutes Early
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preparation Tips */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Preparation Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Test your internet connection before the call</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Have your ID and medical aid card ready</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Prepare a list of symptoms and questions</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Find a quiet, well-lit space for the consultation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}