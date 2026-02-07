"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Video,
  Phone,
  MessageSquare,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, startOfDay, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

interface Doctor {
  id: string;
  userId: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  available: boolean;
  user: {
    name: string;
    avatar?: string;
  };
  telehealthAvailable: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  isPopular?: boolean;
}

export default function BookAppointmentPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  
  const [formData, setFormData] = useState({
    // Step 1: Appointment Type
    appointmentType: "IN_PERSON" as "IN_PERSON" | "TELEHEALTH_VIDEO" | "TELEHEALTH_AUDIO" | "TELEHEALTH_CHAT",
    
    // Step 2: Doctor Selection
    doctorId: "",
    
    // Step 3: Date & Time
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    time: "",
    
    // Step 4: Patient Details
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDateOfBirth: "",
    patientGender: "",
    
    // Step 5: Appointment Details
    reason: "",
    symptoms: "",
    medicalHistory: "",
    notes: "",
    
    // Step 6: Payment
    paymentMethod: "CARD",
    insuranceProvider: "",
    insuranceNumber: "",
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in?redirect=/appointments/book");
      return;
    }

    if (user) {
      // Pre-fill patient details if logged in
      setFormData(prev => ({
        ...prev,
        patientName: user.fullName || "",
        patientEmail: user.primaryEmailAddress?.emailAddress || "",
      }));
      
      fetchDoctors();
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.date]);

  useEffect(() => {
    if (formData.doctorId) {
      const doctor = doctors.find(d => d.id === formData.doctorId);
      setSelectedDoctor(doctor || null);
    }
  }, [formData.doctorId, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/doctors/${formData.doctorId}/availability?date=${formData.date}&type=${formData.appointmentType}`
      );
      const data = await response.json();
      setAvailableSlots(data.slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (step === 1 && !formData.appointmentType) {
      toast({
        title: "Selection Required",
        description: "Please select an appointment type",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !formData.doctorId) {
      toast({
        title: "Selection Required",
        description: "Please select a doctor",
        variant: "destructive",
      });
      return;
    }

    if (step === 3 && (!formData.date || !formData.time)) {
      toast({
        title: "Selection Required",
        description: "Please select date and time",
        variant: "destructive",
      });
      return;
    }

    if (step === 4 && (!formData.patientName || !formData.patientEmail || !formData.patientPhone)) {
      toast({
        title: "Information Required",
        description: "Please fill in all required patient details",
        variant: "destructive",
      });
      return;
    }

    setStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          consultationFee: selectedDoctor?.consultationFee || 500,
          status: "PENDING",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Appointment Booked!",
          description: "Your appointment has been scheduled successfully",
        });
        router.push(`/appointments/${data.id}`);
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    {
      id: "IN_PERSON",
      title: "In-person Visit",
      description: "Visit our healthcare facility for a physical consultation",
      icon: User,
      price: 500,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      features: ["Physical examination", "Lab tests available", "Immediate care"],
    },
    {
      id: "TELEHEALTH_VIDEO",
      title: "Video Consultation",
      description: "Virtual face-to-face consultation via video call",
      icon: Video,
      price: 400,
      color: "bg-green-50",
      iconColor: "text-green-600",
      features: ["From anywhere", "Secure & private", "File sharing"],
    },
    {
      id: "TELEHEALTH_AUDIO",
      title: "Audio Consultation",
      description: "Consult with your doctor over a phone call",
      icon: Phone,
      price: 300,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      features: ["Phone consultation", "No video needed", "Quick check-ins"],
    },
    {
      id: "TELEHEALTH_CHAT",
      title: "Chat Consultation",
      description: "Text-based consultation with file sharing",
      icon: MessageSquare,
      price: 200,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      features: ["Async communication", "File uploads", "Flexible timing"],
    },
  ];

  const getDaySlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const isAvailable = availableSlots.some(slot => slot.time === time && slot.available);
        slots.push({ time, available: isAvailable });
      }
    }
    return slots;
  };

  const calculatePrice = () => {
    const basePrice = selectedDoctor?.consultationFee || 500;
    return basePrice;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {["Type", "Doctor", "Time", "Details", "Medical", "Payment"].map((label, index) => (
              <div
                key={label}
                className={`flex flex-col items-center ${index + 1 <= step ? "text-[#00BFFF]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index + 1 <= step
                      ? "bg-[#00BFFF] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00BFFF] transition-all duration-300"
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Choose Appointment Type</h2>
                  <RadioGroup
                    value={formData.appointmentType}
                    onValueChange={(value: any) => handleInputChange("appointmentType", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {appointmentTypes.map((type) => (
                      <div key={type.id}>
                        <RadioGroupItem
                          value={type.id}
                          id={type.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.id}
                          className={`flex flex-col items-start rounded-xl border-2 p-6 cursor-pointer hover:shadow-lg transition-all ${
                            formData.appointmentType === type.id
                              ? "border-[#00BFFF] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${type.color}`}
                        >
                          <div className="flex items-center w-full mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color}`}>
                              <type.icon className={`w-6 h-6 ${type.iconColor}`} />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="font-bold text-lg">{type.title}</div>
                              <div className="text-[#00BFFF] font-bold">R{type.price}</div>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{type.description}</p>
                          <div className="space-y-2">
                            {type.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Select Doctor</h2>
                  <div className="space-y-4">
                    {doctors
                      .filter(doctor => 
                        formData.appointmentType === "IN_PERSON" || doctor.telehealthAvailable
                      )
                      .map((doctor) => (
                        <div
                          key={doctor.id}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                            formData.doctorId === doctor.id
                              ? "border-[#00BFFF] bg-blue-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleInputChange("doctorId", doctor.id)}
                        >
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={doctor.user.avatar} />
                            <AvatarFallback>
                              {doctor.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{doctor.user.name}</h3>
                                <p className="text-[#00BFFF] font-medium">{doctor.specialty}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                  <span>⭐ {doctor.experience} years experience</span>
                                  <span>💵 R{doctor.consultationFee} consultation</span>
                                </div>
                              </div>
                              <Badge variant={doctor.available ? "default" : "secondary"}>
                                {doctor.available ? "Available" : "Busy"}
                              </Badge>
                            </div>
                            {doctor.telehealthAvailable && (
                              <Badge variant="outline" className="mt-2">
                                <Video className="w-3 h-3 mr-1" />
                                Telehealth Available
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <h3 className="font-semibold mb-4">Select Date</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                          const date = addDays(new Date(), dayOffset);
                          const dateStr = format(date, "yyyy-MM-dd");
                          const isSelected = formData.date === dateStr;
                          
                          return (
                            <button
                              key={dateStr}
                              type="button"
                              onClick={() => {
                                handleInputChange("date", dateStr);
                                setSelectedDate(dateStr);
                              }}
                              className={`p-3 rounded-lg text-center ${
                                isSelected
                                  ? "bg-[#00BFFF] text-white"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            >
                              <div className="text-sm">{format(date, "EEE")}</div>
                              <div className="text-xl font-bold">{format(date, "d")}</div>
                              <div className="text-xs">{format(date, "MMM")}</div>
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="customDate">Or choose specific date</Label>
                        <Input
                          id="customDate"
                          type="date"
                          value={formData.date}
                          onChange={(e) => {
                            handleInputChange("date", e.target.value);
                            setSelectedDate(e.target.value);
                          }}
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <h3 className="font-semibold mb-4">Select Time</h3>
                      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                        {getDaySlots().map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => slot.available && handleInputChange("time", slot.time)}
                            disabled={!slot.available}
                            className={`p-3 rounded text-sm ${
                              formData.time === slot.time
                                ? "bg-[#00BFFF] text-white"
                                : slot.available
                                ? "bg-gray-100 hover:bg-gray-200"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {slot.time}
                            {!slot.available && (
                              <div className="text-xs text-red-500 mt-1">Booked</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Patient Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientName">Full Name *</Label>
                        <Input
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) => handleInputChange("patientName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientEmail">Email Address *</Label>
                        <Input
                          id="patientEmail"
                          type="email"
                          value={formData.patientEmail}
                          onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientPhone">Phone Number *</Label>
                        <Input
                          id="patientPhone"
                          type="tel"
                          value={formData.patientPhone}
                          onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                          required
                          placeholder="+27 12 345 6789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientDateOfBirth">Date of Birth</Label>
                        <Input
                          id="patientDateOfBirth"
                          type="date"
                          value={formData.patientDateOfBirth}
                          onChange={(e) => handleInputChange("patientDateOfBirth", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="patientGender">Gender</Label>
                      <Select
                        value={formData.patientGender}
                        onValueChange={(value) => handleInputChange("patientGender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 5 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Appointment Details</h2>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="reason">Reason for Visit *</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => handleInputChange("reason", e.target.value)}
                        placeholder="e.g., Regular checkup, Specific symptoms, Follow-up"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="symptoms">Symptoms (if any)</Label>
                      <Textarea
                        id="symptoms"
                        value={formData.symptoms}
                        onChange={(e) => handleInputChange("symptoms", e.target.value)}
                        placeholder="Describe your symptoms, when they started, and their severity..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                      <Textarea
                        id="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                        placeholder="Any existing conditions, allergies, medications, or previous surgeries..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Any other information you'd like to share with the doctor..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 6 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                          <SelectItem value="MEDICAL_AID">Medical Aid</SelectItem>
                          <SelectItem value="CASH">Cash Payment</SelectItem>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.paymentMethod === "MEDICAL_AID" && (
                      <>
                        <div>
                          <Label htmlFor="insuranceProvider">Medical Aid Provider</Label>
                          <Input
                            id="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                            placeholder="e.g., Discovery, Bonitas, Momentum"
                          />
                        </div>
                        <div>
                          <Label htmlFor="insuranceNumber">Medical Aid Number</Label>
                          <Input
                            id="insuranceNumber"
                            value={formData.insuranceNumber}
                            onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                            placeholder="Your medical aid membership number"
                          />
                        </div>
                      </>
                    )}

                    <Card className="bg-gray-50">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Payment Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Consultation Fee</span>
                            <span>R{calculatePrice()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Fee</span>
                            <span>R0</span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total Amount</span>
                              <span>R{calculatePrice()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              )}
              <div className="ml-auto">
                {step < 6 ? (
                  <Button onClick={handleNextStep}>
                    Continue to {["Doctor", "Time", "Details", "Medical", "Payment"][step - 1]}
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loading ? "Processing..." : "Confirm & Pay R" + calculatePrice()}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Appointment Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-6">Appointment Summary</h3>
                
                {selectedDoctor && (
                  <div className="space-y-6">
                    {/* Doctor Info */}
                    <div>
                      <h4 className="font-semibold mb-3">Doctor</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={selectedDoctor.user.avatar} />
                          <AvatarFallback>
                            {selectedDoctor.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedDoctor.user.name}</p>
                          <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Appointment Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {formData.date ? format(parseISO(formData.date), "PPP") : "Select date"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{formData.time || "Select time"}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            {getTypeIcon(formData.appointmentType)}
                            <span className="ml-2">{getTypeLabel(formData.appointmentType)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                          <span>Total Amount</span>
                          <span>R{calculatePrice()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        What's Included
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Professional medical consultation</li>
                        <li>• Medical advice and treatment plan</li>
                        <li>• Prescription if needed</li>
                        <li>• Follow-up recommendations</li>
                        {formData.appointmentType.includes("TELEHEALTH") && (
                          <li>• Secure virtual consultation</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {!selectedDoctor && (
                  <div className="text-center py-8">
                    <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a doctor to see appointment details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Need Help?</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-[#00BFFF] mr-2" />
                    <span>Call us: +27 15 307 3000</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-[#00BFFF] mr-2" />
                    <span>Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-[#00BFFF] mr-2" />
                    <span>Cancel up to 24 hours before for full refund</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}