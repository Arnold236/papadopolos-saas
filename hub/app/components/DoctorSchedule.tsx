"use client";

import { useState, useEffect } from "react";
import { Clock, User, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";

interface Appointment {
  id: string;
  patient: {
    name: string;
    email: string;
    phone?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string;
}

interface DoctorScheduleProps {
  doctorId: string;
}

export function DoctorSchedule({ doctorId }: DoctorScheduleProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, [doctorId, selectedDate]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/doctors/${doctorId}/schedule?date=${selectedDate}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchSchedule();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "outline",
      CONFIRMED: "default",
      CANCELLED: "destructive",
      COMPLETED: "secondary",
      RESCHEDULED: "outline",
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today's Schedule
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border rounded-lg"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No appointments scheduled for this date</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {appointment.patient.name}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                      <p className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {appointment.patient.phone || "No phone"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {appointment.patient.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(appointment.status)}
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirm</SelectItem>
                        <SelectItem value="CANCELLED">Cancel</SelectItem>
                        <SelectItem value="COMPLETED">Complete</SelectItem>
                        <SelectItem value="RESCHEDULED">Reschedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {appointment.reason && (
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">Reason:</span> {appointment.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}