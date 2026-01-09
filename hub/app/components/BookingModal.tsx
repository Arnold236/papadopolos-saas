"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSpecialist?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export function BookingModal({ open, onOpenChange, selectedSpecialist }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorId: "",
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    time: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      fetchDoctors();
    }
  }, [open]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.date]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data);
      if (selectedSpecialist && data.length > 0) {
        const doctor = data.find((d: any) => d.user.name === selectedSpecialist);
        if (doctor) {
          setFormData(prev => ({ ...prev, doctorId: doctor.id }));
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(`/api/doctors/${formData.doctorId}/availability?date=${formData.date}`);
      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Appointment booked successfully!");
        onOpenChange(false);
        // Reset form
        setFormData({
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          doctorId: "",
          date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
          time: "",
          reason: "",
          notes: "",
        });
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Full Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleInputChange("patientName", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientEmail">Email *</Label>
              <Input
                id="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone *</Label>
              <Input
                id="patientPhone"
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                placeholder="+27 12 345 6789"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId">Specialist *</Label>
              <Select value={formData.doctorId} onValueChange={(value) => handleInputChange("doctorId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialist" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{doctor.user.name} - {doctor.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select available time" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot, index) => (
                    <SelectItem key={index} value={slot.time} disabled={!slot.available}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{slot.time}</span>
                        {!slot.available && <span className="text-xs text-red-500">(Unavailable)</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="e.g., Regular checkup, Specific symptoms"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any specific concerns or information..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC]" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}