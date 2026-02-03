"use client";

import { useState } from 'react';
import { Send, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import smsService from '@/lib/smsService';

interface SendSMSFormProps {
  defaultRecipient?: string;
  defaultMessage?: string;
  onSuccess?: () => void;
  showTemplateSelector?: boolean;
}

export function SendSMSForm({
  defaultRecipient = '',
  defaultMessage = '',
  onSuccess,
  showTemplateSelector = false,
}: SendSMSFormProps) {
  const [formData, setFormData] = useState({
    to: defaultRecipient,
    body: defaultMessage,
    templateId: '',
  });
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(defaultMessage.length);
  const [estimatedCost, setEstimatedCost] = useState(0);
  
  const templates = smsService.getTemplates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (formData.templateId) {
        // Get template variables from form (you'd need to implement this)
        const variables = {};
        response = await smsService.sendTemplateSMS(
          formData.templateId,
          variables,
          formData.to
        );
      } else {
        response = await smsService.sendSMS({
          to: formData.to,
          body: formData.body,
        });
      }

      if (response.success) {
        toast({
          title: 'SMS Sent Successfully',
          description: 'Message has been queued for delivery',
          variant: 'default',
        });
        
        setFormData({ to: '', body: '', templateId: '' });
        onSuccess?.();
      } else {
        toast({
          title: 'Failed to Send SMS',
          description: response.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send SMS',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        templateId,
        body: template.example,
      }));
    }
  };

  const updateCharacterCount = (text: string) => {
    setCharacterCount(text.length);
    // Estimate cost (this is a simplified calculation)
    const messages = Math.ceil(text.length / 160);
    const cost = messages * 0.5; // Assuming R0.50 per SMS segment
    setEstimatedCost(cost);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Send SMS Message
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Phone Number *</Label>
            <Input
              id="to"
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              placeholder="+27 12 345 6789"
              required
              className="font-mono"
            />
            <p className="text-sm text-gray-500">
              Enter phone number with country code (e.g., +27 for South Africa)
            </p>
          </div>

          {/* Template Selector (Optional) */}
          {showTemplateSelector && templates.length > 0 && (
            <div className="space-y-2">
              <Label>Use Template (Optional)</Label>
              <Select value={formData.templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center justify-between">
                        <span>{template.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {template.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Message Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body">Message *</Label>
              <div className="text-sm text-gray-500">
                {characterCount} characters • ~{Math.ceil(characterCount / 160)} SMS • R{estimatedCost.toFixed(2)}
              </div>
            </div>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, body: e.target.value }));
                updateCharacterCount(e.target.value);
              }}
              placeholder="Type your message here..."
              required
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Maximum 160 characters per SMS. Longer messages will be split automatically.
            </p>
          </div>

          {/* SMS Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">SMS Guidelines:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Include clear call-to-action</li>
                  <li>• Keep messages concise and focused</li>
                  <li>• Avoid using all caps</li>
                  <li>• Include sender identification</li>
                  <li>• Respect patient privacy and preferences</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !formData.to || !formData.body}
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Sending...' : 'Send SMS'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}