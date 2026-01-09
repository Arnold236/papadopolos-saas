"use client";

import { useState } from "react";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/components/DashboardStats";
import { DoctorSchedule } from "@/components/DoctorSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");
  const [selectedDoctor, setSelectedDoctor] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <DashboardStats timeRange={timeRange} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="appointments" className="space-y-6">
              <TabsList>
                <TabsTrigger value="appointments">Recent Appointments</TabsTrigger>
                <TabsTrigger value="patients">New Patients</TabsTrigger>
                <TabsTrigger value="doctors">Doctor Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Recent Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DoctorSchedule doctorId={selectedDoctor === "all" ? "" : selectedDoctor} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      New Patients This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Patients list component would go here */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="doctors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Doctor Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Doctor performance metrics would go here */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full bg-[#00BFFF] text-white py-2 rounded-lg hover:bg-[#0099CC] transition-colors">
                  Schedule New Appointment
                </button>
                <button className="w-full border border-[#00BFFF] text-[#00BFFF] py-2 rounded-lg hover:bg-[#00BFFF] hover:text-white transition-colors">
                  Add New Doctor
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Send Bulk Notifications
                </button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Upcoming appointments list would go here */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}