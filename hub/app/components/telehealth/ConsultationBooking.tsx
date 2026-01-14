"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, Clock, Video, Phone, MessageSquare, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfDay, addMinutes } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ConsultationBookingProps {
  doctorId?: string;
  onSuccess?: () => void;
}

export function ConsultationBooking({ doctorId, onSuccess }: ConsultationBookingProps) {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState<"video" | "audio" | "chat">("video");
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);
  const [symptoms, setSymptoms] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctorId || "");

  const consultationTypes = [
    {
      id: "video",
      title: "Video Consultation",
      description: "Face-to-face video call with your doctor",
      icon: Video,
      price: 500,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "audio",
      title: "Audio Call",
      description: "Voice-only consultation via phone or app",
      icon: Phone,
      price: 300,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "chat",
      title: "Chat Consultation",
      description: "Text-based consultation with file sharing",
      icon: MessageSquare,
      price: 200,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const durations = [
    { value: 15, label: "15 min", priceMultiplier: 0.5 },
    { value: 30, label: "30 min", priceMultiplier: 1 },
    { value: 45, label: "45 min", priceMultiplier: 1.5 },
    { value: 60, label: "60 min", priceMultiplier: 2 },
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate, selectedType]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors?telehealth=true");
      const data = await response.json();
      setDoctors(data);
      if (doctorId) {
        setSelectedDoctor(doctorId);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/telehealth/availability?doctorId=${selectedDoctor}&date=${selectedDate}&type=${selectedType}`
      );
      const data = await response.json();
      setAvailableSlots(data.slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    }
  };

  const calculatePrice = () => {
    const basePrice = consultationTypes.find(t => t.id === selectedType)?.price || 0;
    const durationMultiplier = durations.find(d => d.value === duration)?.priceMultiplier || 1;
    return basePrice * durationMultiplier;
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to book a consultation",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select doctor, date, and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/telehealth/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          type: selectedType.toUpperCase(),
          scheduledAt: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
          duration,
          symptoms,
          consultationFee: calculatePrice(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Consultation Booked!",
          description: "Your telehealth appointment has been scheduled",
        });
        onSuccess?.();
      } else {
        throw new Error("Failed to book consultation");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your consultation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Book Telehealth Consultation</h2>
        <p className="text-gray-600">
          Get expert medical advice from the comfort of your home
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Type */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Consultation Type</h3>
              <RadioGroup
                value={selectedType}
                onValueChange={(value: any) => setSelectedType(value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {consultationTypes.map((type) => (
                  <div key={type.id}>
                    <RadioGroupItem
                      value={type.id}
                      id={type.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.id}
                      className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-[#00BFFF] peer-data-[state=checked]:bg-blue-50 ${type.color}`}
                    >
                      <type.icon className={`w-8 h-8 ${type.iconColor} mb-3`} />
                      <div className="text-center">
                        <div className="font-semibold">{type.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                        <div className="mt-2 font-bold text-lg">R{type.price}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Doctor Selection */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Select Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                      selectedDoctor === doctor.id
                        ? "border-[#00BFFF] bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <img
                      src={doctor.avatar || "/api/placeholder/48/48"}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold">{doctor.name}</div>
                      <div className="text-sm text-gray-600">{doctor.specialty}</div>
                      <div className="text-sm text-[#00BFFF]">
                        R{doctor.consultationFee} consultation
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                      const date = addDays(new Date(), dayOffset);
                      const dateStr = format(date, "yyyy-MM-dd");
                      const isSelected = selectedDate === dateStr;
                      
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-3 rounded-lg text-center ${
                            isSelected
                              ? "bg-[#00BFFF] text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          <div className="text-sm">{format(date, "EEE")}</div>
                          <div className="text-xl font-semibold">{format(date, "d")}</div>
                          <div className="text-xs">{format(date, "MMM")}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Time</h3>
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {getDaySlots().map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded text-sm ${
                          selectedTime === slot.time
                            ? "bg-[#00BFFF] text-white"
                            : slot.available
                            ? "bg-gray-100 hover:bg-gray-200"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <div className="text-xs text-red-500">Full</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration & Symptoms */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Duration</h3>
                  <div className="flex space-x-4">
                    {durations.map((dur) => (
                      <button
                        key={dur.value}
                        onClick={() => setDuration(dur.value)}
                        className={`px-4 py-2 rounded-lg ${
                          duration === dur.value
                            ? "bg-[#00BFFF] text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Symptoms & Concerns (Optional)
                  </h3>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Briefly describe your symptoms or concerns..."
                    className="w-full p-3 border rounded-lg min-h-[100px]"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This helps your doctor prepare for the consultation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Booking */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-6">Consultation Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Type</span>
                  <span className="font-semibold">
                    {consultationTypes.find(t => t.id === selectedType)?.title}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{duration} minutes</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <div className="text-right">
                    <div className="font-semibold">
                      {selectedDate && format(new Date(selectedDate), "MMM d, yyyy")}
                    </div>
                    <div className="text-sm text-gray-600">{selectedTime}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R{calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  className="w-full bg-[#00BFFF] hover:bg-[#0099CC]"
                  onClick={handleBooking}
                  disabled={loading || !selectedTime}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {loading ? "Processing..." : "Book & Pay Now"}
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>✅ Secure payment</p>
                  <p>✅ 24-hour cancellation policy</p>
                  <p>✅ Medical aid claims supported</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4">Why Choose Telehealth?</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-[#00BFFF] mr-2" />
                  <span>No travel or waiting time</span>    
                </div>
                <div className="flex items-center">
                  <Video className="w-4 h-4 text-[#00BFFF] mr-2" />
                  <span>Consult from anywhere</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-[#00BFFF] mr-2" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800">Secure</Badge>
                  <span className="ml-2">End-to-end encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}