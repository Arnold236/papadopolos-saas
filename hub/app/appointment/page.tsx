"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  CalendarPlus,
  Video,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Stethoscope,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, endOfWeek, isToday, isTomorrow } from "date-fns";
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
  patient: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  doctor: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    specialty: string;
    consultationFee: number;
  };
  telehealthConsultation?: {
    id: string;
    meetingUrl: string;
    meetingId: string;
  };
}

export default function AppointmentsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "upcoming">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in?redirect=/appointments");
      return;
    }

    if (user) {
      fetchAppointments();
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery, statusFilter, typeFilter, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/appointments?include=all");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patient.name.toLowerCase().includes(query) ||
          apt.doctor.user.name.toLowerCase().includes(query) ||
          apt.doctor.specialty.toLowerCase().includes(query) ||
          apt.reason.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((apt) => apt.type === typeFilter);
    }

    // Filter by date for calendar view
    if (viewMode === "calendar") {
      filtered = filtered.filter((apt) => apt.date === selectedDate);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredAppointments(filtered);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          cancellationReason,
        }),
      });

      if (response.ok) {
        toast({
          title: "Appointment Cancelled",
          description: "Your appointment has been cancelled successfully",
        });
        setShowCancelDialog(false);
        setCancellationReason("");
        fetchAppointments();
      } else {
        throw new Error("Failed to cancel appointment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          startTime: newTime,
          status: "RESCHEDULED",
        }),
      });

      if (response.ok) {
        toast({
          title: "Appointment Rescheduled",
          description: "Your appointment has been rescheduled successfully",
        });
        setShowRescheduleDialog(false);
        setNewDate("");
        setNewTime("");
        fetchAppointments();
      } else {
        throw new Error("Failed to reschedule appointment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: ClockIcon },
      CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
      COMPLETED: { label: "Completed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      RESCHEDULED: { label: "Rescheduled", color: "bg-purple-100 text-purple-800", icon: Calendar },
    };

    const config = variants[status] || variants.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "TELEHEALTH_VIDEO":
        return <Video className="w-4 h-4" />;
      case "TELEHEALTH_AUDIO":
        return <Phone className="w-4 h-4" />;
      case "TELEHEALTH_CHAT":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "IN_PERSON":
        return "In-person";
      case "TELEHEALTH_VIDEO":
        return "Video Consultation";
      case "TELEHEALTH_AUDIO":
        return "Audio Consultation";
      case "TELEHEALTH_CHAT":
        return "Chat Consultation";
      default:
        return type;
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i);
      days.push(date);
    }
    
    return days;
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter(apt => apt.date === dateStr);
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(`${apt.date}T${apt.startTime}`) >= new Date())
    .slice(0, 5);

  const todayAppointments = appointments.filter(apt => 
    apt.date === format(new Date(), "yyyy-MM-dd")
  );

  if (!isLoaded || loading) {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Appointments</h1>
              <p className="text-gray-600">Manage and schedule your healthcare appointments</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/appointments/book">
                <Button className="bg-[#00BFFF] hover:bg-[#0099CC]">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
              </Link>
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
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
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold">{todayAppointments.length}</p>
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
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(a => a.status === "PENDING").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
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
                    {appointments.filter(a => a.status === "COMPLETED").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search appointments by name, doctor, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IN_PERSON">In-person</SelectItem>
                  <SelectItem value="TELEHEALTH_VIDEO">Video</SelectItem>
                  <SelectItem value="TELEHEALTH_AUDIO">Audio</SelectItem>
                  <SelectItem value="TELEHEALTH_CHAT">Chat</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="list">All Appointments</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {format(currentWeek, "MMMM yyyy")}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentWeek(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {getWeekDays().map((date, index) => {
                const dayAppointments = getAppointmentsForDay(date);
                const isCurrentDay = isToday(date);
                
                return (
                  <Card
                    key={index}
                    className={`${isCurrentDay ? "border-[#00BFFF] bg-blue-50" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        <div className="flex flex-col items-center">
                          <span className="text-gray-500">{format(date, "EEE")}</span>
                          <span className={`text-xl ${isCurrentDay ? "text-[#00BFFF]" : "text-gray-900"}`}>
                            {format(date, "d")}
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-xs p-2 bg-white rounded border"
                            onClick={() => setSelectedAppointment(apt)}
                          >
                            <div className="font-medium truncate">
                              {apt.doctor.user.name.split(" ")[0]}
                            </div>
                            <div className="text-gray-500">{apt.startTime}</div>
                            {getStatusBadge(apt.status)}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-6">
          {viewMode === "upcoming" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onSelect={setSelectedAppointment}
                      onCancel={() => {
                        setSelectedAppointment(apt);
                        setShowCancelDialog(true);
                      }}
                      onReschedule={() => {
                        setSelectedAppointment(apt);
                        setNewDate(apt.date);
                        setNewTime(apt.startTime);
                        setShowRescheduleDialog(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                    <p className="text-gray-600 mb-4">
                      Schedule your next appointment to get started
                    </p>
                    <Link href="/appointments/book">
                      <Button>Book Appointment</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {viewMode === "list" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
              {filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onSelect={setSelectedAppointment}
                      onCancel={() => {
                        setSelectedAppointment(apt);
                        setShowCancelDialog(true);
                      }}
                      onReschedule={() => {
                        setSelectedAppointment(apt);
                        setNewDate(apt.date);
                        setNewTime(apt.startTime);
                        setShowRescheduleDialog(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filters
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        {todayAppointments.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todayAppointments.map((apt) => {
                    const appointmentTime = new Date(`${apt.date}T${apt.startTime}`);
                    const now = new Date();
                    const isUpcoming = appointmentTime > now;
                    const isInProgress = appointmentTime <= now && 
                      new Date(`${apt.date}T${apt.endTime}`) > now;
                    
                    return (
                      <div
                        key={apt.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isInProgress ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#00BFFF]">
                              {apt.startTime}
                            </div>
                            <div className="text-sm text-gray-500">
                              {apt.endTime}
                            </div>
                          </div>
                          
                          <div className="h-10 border-l border-gray-300"></div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={apt.doctor.user.avatar} />
                                <AvatarFallback>
                                  {apt.doctor.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{apt.doctor.user.name}</h4>
                                <p className="text-sm text-gray-600">{apt.doctor.specialty}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{apt.reason}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {isInProgress && (
                            <Badge className="bg-green-100 text-green-800">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                              In Progress
                            </Badge>
                          )}
                          {isUpcoming && (
                            <Badge variant="outline">Upcoming</Badge>
                          )}
                          
                          {apt.type === "TELEHEALTH_VIDEO" && apt.telehealthConsultation ? (
                            <Link href={`/telehealth/${apt.telehealthConsultation.id}`}>
                              <Button size="sm">
                                <Video className="w-4 h-4 mr-2" />
                                Join Call
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Cancel Appointment Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Appointment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{selectedAppointment.doctor.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{format(new Date(selectedAppointment.date), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span>{selectedAppointment.reason}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="cancellationReason">Cancellation Reason (Optional)</Label>
                <Textarea
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Current Appointment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{selectedAppointment.doctor.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Date:</span>
                    <span>{format(new Date(selectedAppointment.date), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Time:</span>
                    <span>{selectedAppointment.startTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newDate">New Date</Label>
                  <Input
                    id="newDate"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div>
                  <Label htmlFor="newTime">New Time</Label>
                  <Select value={newTime} onValueChange={setNewTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Note: Rescheduling may be subject to availability
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleAppointment}>
              Reschedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  onSelect: (apt: Appointment) => void;
  onCancel: () => void;
  onReschedule: () => void;
}

function AppointmentCard({ appointment, onSelect, onCancel, onReschedule }: AppointmentCardProps) {
  const appointmentDate = new Date(appointment.date);
  const isPast = appointmentDate < new Date();
  const isToday = isToday(appointmentDate);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Section - Date & Time */}
          <div className="flex items-center gap-4">
            <div className="text-center min-w-[70px]">
              <div className="text-2xl font-bold text-[#00BFFF]">
                {format(appointmentDate, "d")}
              </div>
              <div className="text-sm text-gray-500">
                {format(appointmentDate, "MMM")}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {format(appointmentDate, "EEE")}
              </div>
            </div>
            
            <div className="h-12 border-l border-gray-300"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">
                  {appointment.startTime} - {appointment.endTime}
                </span>
                {isToday && (
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    Today
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getTypeIcon(appointment.type)}
                <span className="text-sm text-gray-600">
                  {getTypeLabel(appointment.type)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Middle Section - Doctor & Patient Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={appointment.doctor.user.avatar} />
                <AvatarFallback>
                  {appointment.doctor.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{appointment.doctor.user.name}</h4>
                <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Reason:</span> {appointment.reason}
              </p>
              {appointment.notes && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>
          
          {/* Right Section - Actions & Status */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              {getStatusBadge(appointment.status)}
              <Badge variant="outline">
                R{appointment.consultationFee}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {appointment.status === "CONFIRMED" && !isPast && (
                <>
                  {appointment.type === "TELEHEALTH_VIDEO" && appointment.telehealthConsultation ? (
                    <Link href={`/telehealth/${appointment.telehealthConsultation.id}`}>
                      <Button size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Join Call
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => onSelect(appointment)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onSelect(appointment)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onReschedule}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onCancel}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Receipt
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              
              {appointment.status === "PENDING" && (
                <>
                  <Button size="sm" variant="outline" onClick={onReschedule}>
                    Reschedule
                  </Button>
                  <Button size="sm" variant="destructive" onClick={onCancel}>
                    Cancel
                  </Button>
                </>
              )}
              
              {appointment.status === "COMPLETED" && (
                <Button size="sm" variant="outline" onClick={() => onSelect(appointment)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Summary
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}