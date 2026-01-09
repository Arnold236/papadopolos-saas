"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Clock, 
  User, 
  Calendar, 
  Phone, 
  MapPin,
  Brain,
  Stethoscope,
  Shield,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  type?: "text" | "appointment" | "doctor" | "service";
  data?: any;
}

interface QuickAction {
  title: string;
  query: string;
  icon: React.ReactNode;
  color: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your healthcare assistant. How can I help you today? You can ask about appointments, doctors, services, or general health information.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      title: "Book Appointment",
      query: "How do I book an appointment?",
      icon: <Calendar className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      title: "Doctor Schedule",
      query: "Show me available doctors today",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      title: "Our Services",
      query: "What healthcare services do you offer?",
      icon: <Stethoscope className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
    {
      title: "Contact Info",
      query: "What are your contact details?",
      icon: <Phone className="w-4 h-4" />,
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        role: "assistant",
        timestamp: new Date(),
        type: data.type,
        data: data.data,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update suggestions based on context
      updateSuggestions(data.intent);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting. Please try again or contact us directly.",
        role: "assistant",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  const updateSuggestions = (intent: string) => {
    const suggestionMap: Record<string, string[]> = {
      appointment: [
        "Can I reschedule my appointment?",
        "What documents should I bring?",
        "How much does a consultation cost?",
      ],
      doctors: [
        "Who specializes in cardiology?",
        "Show me pediatricians available tomorrow",
        "What are Dr. Smith's working hours?",
      ],
      services: [
        "Do you offer emergency care?",
        "What preventive services do you have?",
        "Do you accept medical aid?",
      ],
      general: [
        "What are your operating hours?",
        "Where are you located?",
        "How do I get my medical records?",
      ],
    };

    setSuggestions(suggestionMap[intent] || [
      "How do I book an appointment?",
      "What are your contact details?",
      "Who are your specialists?",
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === "appointment" && message.data) {
      return (
        <div className="space-y-3">
          <p>{message.content}</p>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Appointment Details:</span>
                </div>
                <p><strong>Doctor:</strong> {message.data.doctor}</p>
                <p><strong>Date:</strong> {message.data.date}</p>
                <p><strong>Time:</strong> {message.data.time}</p>
                <p><strong>Duration:</strong> {message.data.duration}</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  Book This Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (message.type === "doctor" && message.data) {
      return (
        <div className="space-y-3">
          <p>{message.content}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {message.data.doctors.map((doctor: any, idx: number) => (
              <Card key={idx} className="bg-green-50 border-green-200">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={doctor.image} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-green-700">{doctor.specialty}</p>
                      <p className="text-xs text-gray-600">Available: {doctor.availability}</p>
                      <Button size="sm" className="mt-2 text-xs">
                        View Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "service" && message.data) {
      return (
        <div className="space-y-3">
          <p>{message.content}</p>
          <div className="space-y-2">
            {message.data.services.map((service: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p>{message.content}</p>;
  };

  return (
    <>
      {/* Chatbot Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-[#00BFFF] hover:bg-[#0099CC] shadow-lg"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <Card className="relative w-full max-w-md h-[600px] flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-[#00BFFF] text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#00BFFF]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">Healthcare Assistant</h3>
                  <p className="text-xs opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                          ? "bg-[#00BFFF] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                    >
                      <div className="mb-1">
                        {renderMessageContent(message)}
                      </div>
                      <div className={`text-xs ${message.role === "user" ? "text-blue-100" : "text-gray-500"} text-right`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-3 border-t">
                <p className="text-sm text-gray-600 mb-2">You might want to ask:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleQuickAction(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your health-related question..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button 
                  onClick={handleSend}
                  className="bg-[#00BFFF] hover:bg-[#0099CC]"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`h-10 justify-start ${action.color}`}
                      onClick={() => handleQuickAction(action.query)}
                    >
                      {action.icon}
                      <span className="ml-2 text-sm">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}