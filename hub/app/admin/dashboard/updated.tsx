"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  Calendar, 
  FileText, 
  User, 
  Clock, 
  Bell, 
  Settings,
  Plus,
  Stethoscope,
  Pill,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { BookingModal } from "@/components/BookingModal";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  doctor: {
    user: {
      name: string;
      avatar: string;
    };
    specialty: string;
  };
}

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  fileType: string;
  uploadedBy: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        fetch(`/api/appointments?userId=${user?.id}`),
        fetch(`/api/medical-records?userId=${user?.id}`),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const recordsData = await recordsRes.json();

      setAppointments(appointmentsData);
      setMedicalRecords(recordsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date())
    .slice(0, 3);

  const stats = {
    totalAppointments: appointments.length,
    upcomingAppointments: upcomingAppointments.length,
    pendingRecords: medicalRecords.filter(r => r.fileType === "pending").length,
    prescriptions: 5, // This would come from API
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
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Button onClick={() => setShowBookingModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicalRecords.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.prescriptions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="appointments" className="space-y-6">
              <TabsList>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Appointments
                      </span>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((apt) => (
                          <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar>
                                  <AvatarImage src={apt.doctor.user.avatar} />
                                  <AvatarFallback>
                                    {apt.doctor.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{apt.doctor.user.name}</h4>
                                  <p className="text-sm text-gray-600">{apt.doctor.specialty}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm">
                                      {format(new Date(apt.date), "MMM d, yyyy")}
                                    </span>
                                    <span className="text-sm">
                                      {apt.startTime} - {apt.endTime}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-2">{apt.reason}</p>
                                </div>
                              </div>
                              <Badge variant={
                                apt.status === "CONFIRMED" ? "default" :
                                apt.status === "PENDING" ? "outline" :
                                "secondary"
                              }>
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                        <p className="text-gray-600 mb-4">
                          Book your first appointment to get started
                        </p>
                        <Button onClick={() => setShowBookingModal(true)}>
                          Book Appointment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="records">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Medical Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Medical records content */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Doctors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Recent Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Recent doctors list */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BookingModal
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
      />
    </div>
  );
}