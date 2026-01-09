"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  AlertCircle,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfDay } from "date-fns";
import { toast } from "@/hooks/use-toast";

const appointmentSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientEmail: z.string().email("Invalid email address"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  doctorId: z.string().min(1, "Please select a specialist"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  reason: z.string().optional(),
  notes: z.string().optional(),
  isGuest: z.boolean().default(false),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSpecialist?: string;
  doctorId?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  isPopular?: boolean;
}

interface Doctor {
  id: string;
  user: {
    name: string;
  };
  specialty: string;
  consultationFee: number;
  experience: number;
  available: boolean;
}

export function BookingModal({ open, onOpenChange, selectedSpecialist, doctorId }: BookingModalProps) {
  const { isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState<"guest" | "user">(isSignedIn ? "user" : "guest");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: user?.fullName || "",
      patientEmail: user?.primaryEmailAddress?.emailAddress || "",
      patientPhone: "",
      doctorId: "",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      time: "",
      reason: "",
      notes: "",
      isGuest: !isSignedIn,
    },
  });

  const selectedDate = watch("date");
  const selectedDoctorId = watch("doctorId");

  useEffect(() => {
    if (open) {
      fetchDoctors();
      if (user) {
        setValue("patientName", user.fullName || "");
        setValue("patientEmail", user.primaryEmailAddress?.emailAddress || "");
      }
    }
  }, [open, user]);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctors.find(d => d.id === selectedDoctorId);
      setSelectedDoctor(doctor || null);
    }
  }, [selectedDoctorId, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data);
      
      // Pre-select if doctorId is provided
      if (doctorId) {
        setValue("doctorId", doctorId);
      }
      // Pre-select by specialist name
      else if (selectedSpecialist) {
        const doctor = data.find((d: Doctor) => 
          d.user.name.toLowerCase().includes(selectedSpecialist.toLowerCase())
        );
        if (doctor) {
          setValue("doctorId", doctor.id);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/doctors/${selectedDoctorId}/availability?date=${selectedDate}`
      );
      const data = await response.json();
      
      // Mark popular time slots (9 AM - 11 AM, 2 PM - 4 PM)
      const slots = data.slots.map((slot: TimeSlot) => ({
        ...slot,
        isPopular: ["09:00", "10:00", "14:00", "15:00"].includes(slot.time),
      }));
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(isSignedIn ? {
            "Authorization": `Bearer ${await user?.getToken()}`
          } : {})
        },
        body: JSON.stringify({
          ...data,
          isGuest: !isSignedIn,
          userId: isSignedIn ? user?.id : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Appointment Booked!",
          description: "Your appointment has been scheduled successfully.",
          variant: "default",
        });

        // Send confirmation email
        if (isSignedIn && user) {
          await sendAppointmentConfirmation(data, result.appointment);
        }

        reset();
        onOpenChange(false);
      } else {
        throw new Error(result.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendAppointmentConfirmation = async (data: AppointmentFormData, appointment: any) => {
    try {
      await fetch("/api/email/confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment,
          patient: data,
          user: {
            id: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
          },
        }),
      });
    } catch (error) {
      console.error("Error sending confirmation:", error);
    }
  };

  const benefits = [
    { icon: "📋", title: "Medical History", desc: "Track and manage your health records" },
    { icon: "🔔", title: "Smart Reminders", desc: "Never miss an appointment" },
    { icon: "💾", title: "Digital Prescriptions", desc: "Access prescriptions anytime" },
    { icon: "⚡", title: "Quick Rebooking", desc: "One-click appointment scheduling" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6" />
            Book Healthcare Appointment
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="guest" className="data-[state=active]:bg-[#00BFFF]">
              Guest Booking
            </TabsTrigger>
            <TabsTrigger 
              value="user" 
              className="data-[state=active]:bg-[#00BFFF] relative"
              disabled={!isSignedIn && activeTab === "guest"}
            >
              Member Booking
              {!isSignedIn && (
                <Badge className="ml-2 bg-amber-500 hover:bg-amber-600">
                  Sign In Required
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Guest Booking */}
          <TabsContent value="guest" className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800">Guest Booking</h4>
                  <p className="text-amber-700 text-sm">
                    You're booking as a guest. Create an account to enjoy additional benefits:
                  </p>
                </div>
              </div>
              
              {!isSignedIn && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl mb-2">{benefit.icon}</div>
                      <p className="font-medium text-sm">{benefit.title}</p>
                      <p className="text-xs text-gray-600">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Form fields same as before */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name *</Label>
                  <Input
                    id="patientName"
                    {...register("patientName")}
                    placeholder="John Doe"
                  />
                  {errors.patientName && (
                    <p className="text-red-500 text-sm">{errors.patientName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientEmail">Email *</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    {...register("patientEmail")}
                    placeholder="john@example.com"
                  />
                  {errors.patientEmail && (
                    <p className="text-red-500 text-sm">{errors.patientEmail.message}</p>
                  )}
                </div>
              </div>

              {/* Rest of the form... */}
              
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC]"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book as Guest"}
                </Button>
              </div>

              {!isSignedIn && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Want member benefits?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        // Trigger Clerk sign up
                        // You would integrate Clerk modal here
                      }}
                      className="text-[#00BFFF] hover:underline font-medium"
                    >
                      Create free account
                    </button>
                  </p>
                </div>
              )}
            </form>
          </TabsContent>

          {/* Member Booking */}
          <TabsContent value="user" className="space-y-6">
            {isSignedIn ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Welcome back, {user?.firstName}!
                      </h4>
                      <p className="text-green-700 text-sm">
                        Your medical history and preferences will be used for faster booking.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={user?.fullName || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        From your account profile
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={user?.primaryEmailAddress?.emailAddress || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Confirmation will be sent here
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Phone Number *</Label>
                    <Input
                      id="patientPhone"
                      {...register("patientPhone")}
                      placeholder="+27 12 345 6789"
                    />
                    {errors.patientPhone && (
                      <p className="text-red-500 text-sm">{errors.patientPhone.message}</p>
                    )}
                  </div>

                  {/* Doctor selection, date/time, etc. */}
                  
                  {selectedDoctor && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-blue-800">
                            {selectedDoctor.user.name}
                          </h4>
                          <p className="text-blue-700">{selectedDoctor.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>⭐ {selectedDoctor.experience} years experience</span>
                            <span>💵 R{selectedDoctor.consultationFee} consultation fee</span>
                          </div>
                        </div>
                        <Badge variant={selectedDoctor.available ? "default" : "secondary"}>
                          {selectedDoctor.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Popular time slots highlight */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4" />
                      Available Time Slots
                    </Label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setValue("time", slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border text-center transition-all ${slot.time === watch("time")
                              ? "bg-[#00BFFF] text-white border-[#00BFFF]"
                              : slot.available
                                ? slot.isPopular
                                  ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <div className="text-sm font-medium">{slot.time}</div>
                          {slot.isPopular && slot.available && (
                            <div className="text-xs mt-1 text-amber-600">Popular</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC]"
                      disabled={loading}
                    >
                      {loading ? "Booking..." : "Book Appointment"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
                <p className="text-gray-600 mb-6">
                  Please sign in to access member booking benefits
                </p>
                <div className="flex gap-3 justify-center">
                  <SignInButton mode="modal">
                    <Button variant="outline">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-[#00BFFF] hover:bg-[#0099CC]">
                      Create Account
                    </Button>
                  </SignUpButton>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}