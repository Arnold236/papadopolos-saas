"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, Clock, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  timeRange?: "today" | "week" | "month";
}

export function DashboardStats({ timeRange = "today" }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    totalPatients: 0,
    availableDoctors: 0,
    averageWaitTime: "15 min",
    revenue: "$0",
  });

  const [trends, setTrends] = useState({
    appointments: { change: 12, isPositive: true },
    patients: { change: 8, isPositive: true },
    revenue: { change: 15, isPositive: true },
  });

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/stats?range=${timeRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: trends.appointments,
    },
    {
      title: "Confirmed Today",
      value: stats.confirmedAppointments,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: stats.pendingAppointments,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: trends.patients,
    },
    {
      title: "Available Doctors",
      value: stats.availableDoctors,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Revenue",
      value: stats.revenue,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: trends.revenue,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.trend && (
              <div className="flex items-center text-xs mt-1">
                {stat.trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend.isPositive ? "text-green-600" : "text-red-600"}>
                  {stat.trend.change}% from last {timeRange}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}