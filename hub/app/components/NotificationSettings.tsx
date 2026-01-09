"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    smsEnabled: true,
    appointmentReminders: true,
    appointmentConfirmations: true,
    appointmentCancellations: true,
    remindersBeforeHours: 24,
    dailyDigest: false,
    marketingEmails: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/notifications/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
              <Switch
                id="emailEnabled"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => updateSetting("emailEnabled", checked)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointmentConfirmations">Appointment Confirmations</Label>
              <Switch
                id="appointmentConfirmations"
                checked={settings.appointmentConfirmations}
                onCheckedChange={(checked) => updateSetting("appointmentConfirmations", checked)}
                disabled={loading || !settings.emailEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointmentCancellations">Appointment Cancellations</Label>
              <Switch
                id="appointmentCancellations"
                checked={settings.appointmentCancellations}
                onCheckedChange={(checked) => updateSetting("appointmentCancellations", checked)}
                disabled={loading || !settings.emailEnabled}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="smsEnabled">Enable SMS Notifications</Label>
              <Switch
                id="smsEnabled"
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => updateSetting("smsEnabled", checked)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
              <Switch
                id="appointmentReminders"
                checked={settings.appointmentReminders}
                onCheckedChange={(checked) => updateSetting("appointmentReminders", checked)}
                disabled={loading || !settings.smsEnabled}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Reminder Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reminderHours">Remind Before Appointment</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="reminderHours"
                  min={1}
                  max={48}
                  step={1}
                  value={[settings.remindersBeforeHours]}
                  onValueChange={([value]) => updateSetting("remindersBeforeHours", value)}
                  disabled={loading}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16">
                  {settings.remindersBeforeHours} hours
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Other Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyDigest">Daily Digest Email</Label>
              <Switch
                id="dailyDigest"
                checked={settings.dailyDigest}
                onCheckedChange={(checked) => updateSetting("dailyDigest", checked)}
                disabled={loading || !settings.emailEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
                disabled={loading || !settings.emailEnabled}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}