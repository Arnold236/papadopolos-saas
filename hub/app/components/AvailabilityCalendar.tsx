"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";

interface AvailabilityCalendarProps {
  doctorId: string;
  onDateSelect: (date: Date) => void;
}

export function AvailabilityCalendar({ doctorId, onDateSelect }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth, doctorId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const response = await fetch(
        `/api/doctors/${doctorId}/availability-range?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await response.json();
      setAvailability(data.availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDayClass = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const baseClasses = "h-10 w-10 rounded-full flex items-center justify-center text-sm";
    
    if (!isSameMonth(day, currentMonth)) {
      return `${baseClasses} text-gray-400`;
    }
    
    if (isToday(day)) {
      return `${baseClasses} bg-[#00BFFF] text-white`;
    }
    
    if (availability[dateStr]) {
      return `${baseClasses} bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer`;
    }
    
    return `${baseClasses} bg-gray-100 text-gray-700 cursor-not-allowed`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Availability Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  return (
                    <button
                      key={dateStr}
                      onClick={() => availability[dateStr] && onDateSelect(day)}
                      className={getDayClass(day)}
                      disabled={!availability[dateStr]}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-100"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00BFFF]"></div>
                  <span>Today</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}