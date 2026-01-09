import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";

const prisma = new PrismaClient();

// Initialize OpenAI (you can also use other providers like Anthropic, or local models)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Healthcare knowledge base
const HEALTHCARE_KNOWLEDGE = {
  services: [
    "Emergency Care - 24/7 emergency medical services with immediate attention",
    "Preventive Care - Regular checkups, health screenings, and vaccinations",
    "Family Medicine - Comprehensive healthcare for all family members",
    "Specialized Care - Expert treatment by certified specialists in various fields",
    "Pediatric Care - Child health and development services",
    "Geriatric Care - Specialized care for elderly patients",
    "Mental Health - Counseling and psychiatric services",
    "Physical Therapy - Rehabilitation and mobility services",
    "Diagnostic Services - Laboratory tests and imaging services",
  ],
  
  specialties: [
    "Cardiology - Heart disease prevention and treatment",
    "Neurology - Brain and nervous system disorders",
    "Pediatrics - Children's health and development",
    "Orthopedics - Bone and joint treatments",
    "Dermatology - Skin health and cosmetic procedures",
    "Gynecology - Women's health services",
    "Oncology - Cancer diagnosis and treatment",
    "Endocrinology - Hormone and metabolic disorders",
    "Gastroenterology - Digestive system disorders",
  ],
  
  faq: {
    "appointment booking": "You can book appointments online through our website, via phone at +27 15 307 3000, or by visiting our facility. Online booking is available 24/7.",
    "cancellation policy": "Appointments can be cancelled up to 24 hours in advance without charge. Late cancellations may incur a fee.",
    "operating hours": "Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM. Emergency services are available 24/7.",
    "insurance acceptance": "We accept most major medical aids including Discovery, Bonitas, Momentum, and GEMS. Please bring your medical aid card to your appointment.",
    "required documents": "Please bring your ID, medical aid card (if applicable), and any previous medical records or prescriptions.",
    "emergency contact": "For emergencies, call +27 15 307 3111 or visit our emergency department immediately.",
    "parking availability": "We have free parking available for patients and visitors with designated disabled parking spaces.",
    "pharmacy services": "We have an in-house pharmacy open during regular hours. Prescriptions can be filled immediately after consultation.",
    "telemedicine": "We offer virtual consultations for follow-up appointments and non-emergency cases. Book through our website.",
    "prescription refills": "Prescription refills can be requested through our patient portal or by calling our pharmacy.",
  },
  
  locations: [
    {
      name: "Main Hospital",
      address: "123 Healthcare Street, Tzaneen, Limpopo",
      phone: "+27 15 307 3000",
      hours: "24/7 Emergency, Regular hours as above",
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Determine intent
    const intent = await determineIntent(message);
    
    // Get relevant data based on intent
    let data = null;
    let responseText = "";
    let responseType: "text" | "appointment" | "doctor" | "service" = "text";

    switch (intent) {
      case "appointment":
        const appointmentData = await handleAppointmentQuery(message);
        responseText = appointmentData.response;
        data = appointmentData.data;
        responseType = appointmentData.type as any;
        break;
        
      case "doctors":
        const doctorsData = await handleDoctorsQuery(message);
        responseText = doctorsData.response;
        data = doctorsData.data;
        responseType = "doctor";
        break;
        
      case "services":
        const servicesData = await handleServicesQuery(message);
        responseText = servicesData.response;
        data = servicesData.data;
        responseType = "service";
        break;
        
      case "general":
        const generalResponse = await handleGeneralQuery(message);
        responseText = generalResponse;
        break;
        
      case "emergency":
        responseText = "🚨 EMERGENCY: If this is a medical emergency, please call +27 15 307 3111 immediately or go to our emergency department at 123 Healthcare Street, Tzaneen. Do not wait for a response here.";
        break;
        
      default:
        responseText = await generateAIResponse(message);
    }

    return NextResponse.json({
      text: responseText,
      type: responseType,
      data: data,
      intent: intent,
    });
    
  } catch (error) {
    console.error("Chatbot error:", error);
    
    // Fallback response
    return NextResponse.json({
      text: "I apologize, but I'm having trouble processing your request. Please try rephrasing your question or contact our front desk at +27 15 307 3000 for immediate assistance.",
      type: "text",
      intent: "error",
    });
  }
}

async function determineIntent(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // Intent detection based on keywords
  const intentKeywords: Record<string, string[]> = {
    appointment: [
      "appointment", "book", "schedule", "reschedule", "cancel", 
      "availability", "slot", "time", "date", "meeting"
    ],
    doctors: [
      "doctor", "specialist", "cardiologist", "neurologist", "pediatrician",
      "orthopedic", "dermatologist", "gp", "physician", "surgeon",
      "schedule", "available", "working hours"
    ],
    services: [
      "service", "offer", "provide", "treatment", "care",
      "emergency", "preventive", "family", "specialized",
      "test", "scan", "x-ray", "laboratory"
    ],
    emergency: [
      "emergency", "urgent", "immediate", "now", "asap",
      "bleeding", "pain", "heart attack", "stroke", "unconscious",
      "accident", "injury"
    ],
    location: [
      "location", "address", "where", "find", "map",
      "directions", "parking", "visit"
    ],
    contact: [
      "contact", "phone", "number", "email", "call",
      "reach", "get in touch"
    ],
    hours: [
      "hours", "open", "close", "time", "weekend",
      "saturday", "sunday", "holiday"
    ],
    insurance: [
      "insurance", "medical aid", "cover", "payment",
      "cost", "price", "fee", "bill"
    ],
  };

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }

  return "general";
}

async function handleAppointmentQuery(message: string) {
  const lowerMessage = message.toLowerCase();
  
  try {
    // Check for specific doctor availability
    if (lowerMessage.includes("available") || lowerMessage.includes("slot") || lowerMessage.includes("today")) {
      const doctors = await prisma.doctor.findMany({
        where: {
          available: true,
        },
        include: {
          user: true,
          availability: {
            where: {
              date: {
                gte: new Date(),
              },
              isAvailable: true,
            },
            take: 5,
          },
        },
        take: 3,
      });

      if (doctors.length > 0) {
        const availableSlots = doctors.map(doctor => ({
          doctor: doctor.user.name,
          specialty: doctor.specialty,
          slots: doctor.availability.slice(0, 3),
        }));

        return {
          response: `I found some available appointments. Here are the next available slots:`,
          data: {
            doctors: availableSlots.map(slot => ({
              name: slot.doctor,
              specialty: slot.specialty,
              availability: slot.slots.length > 0 
                ? slot.slots.map(s => `${new Date(s.date).toLocaleDateString()} at ${s.startTime}`).join(", ")
                : "No slots today",
            })),
          },
          type: "appointment",
        };
      }
    }

    // General appointment information
    return {
      response: `To book an appointment, you can:\n\n1. **Online Booking**: Visit our website and use the booking form\n2. **Phone Booking**: Call us at +27 15 307 3000\n3. **In-Person**: Visit our reception during operating hours\n\nPlease have your ID and medical aid information ready. You can cancel or reschedule up to 24 hours before your appointment without charge.`,
      type: "text",
    };
    
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    return {
      response: "I can help you book appointments. You can book online, by phone (+27 15 307 3000), or in person. What type of specialist are you looking for?",
      type: "text",
    };
  }
}

async function handleDoctorsQuery(message: string) {
  const lowerMessage = message.toLowerCase();
  
  try {
    let doctors;
    
    // Check for specific specialty
    const specialties = [
      "cardiologist", "neurologist", "pediatrician", "orthopedic", 
      "dermatologist", "gp", "general practitioner", "surgeon"
    ];
    
    const requestedSpecialty = specialties.find(s => lowerMessage.includes(s));
    
    if (requestedSpecialty) {
      doctors = await prisma.doctor.findMany({
        where: {
          specialty: {
            contains: requestedSpecialty,
            mode: "insensitive",
          },
          available: true,
        },
        include: {
          user: true,
        },
        take: 5,
      });
    } else {
      // Get all available doctors
      doctors = await prisma.doctor.findMany({
        where: {
          available: true,
        },
        include: {
          user: true,
        },
        take: 5,
      });
    }

    if (doctors.length > 0) {
      const doctorsList = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.user.name,
        specialty: doctor.specialty,
        experience: `${doctor.experience} years`,
        available: doctor.available,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.user.name}`,
      }));

      return {
        response: `Here are our healthcare specialists ${requestedSpecialty ? `in ${requestedSpecialty}` : ""}:`,
        data: { doctors: doctorsList },
        type: "doctor",
      };
    }

    return {
      response: `Our healthcare team includes specialists in various fields:\n\n${HEALTHCARE_KNOWLEDGE.specialties.map(s => `• ${s}`).join('\n')}\n\nYou can view detailed profiles and availability on our website.`,
      type: "text",
    };
    
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return {
      response: `Our medical team includes:\n\n${HEALTHCARE_KNOWLEDGE.specialties.slice(0, 5).map(s => `• ${s}`).join('\n')}\n\nFor specific availability, please contact our reception.`,
      type: "text",
    };
  }
}

async function handleServicesQuery(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific service
  const serviceKeywords = [
    { key: "emergency", services: ["Emergency Care"] },
    { key: "preventive", services: ["Preventive Care", "Health Screenings"] },
    { key: "family", services: ["Family Medicine"] },
    { key: "specialized", services: ["Specialized Care"] },
    { key: "pediatric", services: ["Pediatric Care"] },
    { key: "mental", services: ["Mental Health"] },
    { key: "therapy", services: ["Physical Therapy"] },
    { key: "diagnostic", services: ["Diagnostic Services"] },
  ];
  
  const matchedService = serviceKeywords.find(item => lowerMessage.includes(item.key));
  
  if (matchedService) {
    const services = HEALTHCARE_KNOWLEDGE.services.filter(s => 
      matchedService.services.some(ms => s.includes(ms))
    );
    
    return {
      response: `Here are our ${matchedService.key} services:`,
      data: {
        services: services.map(s => ({
          name: s.split(" - ")[0],
          description: s.split(" - ")[1] || s,
        })),
      },
      type: "service",
    };
  }

  // Return all services
  return {
    response: "We offer comprehensive healthcare services including:",
    data: {
      services: HEALTHCARE_KNOWLEDGE.services.map(s => ({
        name: s.split(" - ")[0],
        description: s.split(" - ")[1] || s,
      })),
    },
    type: "service",
  };
}

async function handleGeneralQuery(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Check FAQ
  for (const [keyword, answer] of Object.entries(HEALTHCARE_KNOWLEDGE.faq)) {
    if (lowerMessage.includes(keyword)) {
      return answer;
    }
  }
  
  // Check location queries
  if (lowerMessage.includes("location") || lowerMessage.includes("address") || lowerMessage.includes("where")) {
    const location = HEALTHCARE_KNOWLEDGE.locations[0];
    return `Our main healthcare facility is located at:\n\n${location.name}\n${location.address}\nPhone: ${location.phone}\n\nWe have free parking available and the facility is wheelchair accessible.`;
  }
  
  // Check contact queries
  if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
    return `You can contact us through:\n\n📞 **Phone**: +27 15 307 3000 (Main)\n📞 **Emergency**: +27 15 307 3111\n📧 **Email**: info@tzaneenhub.co.za\n📍 **Address**: 123 Healthcare Street, Tzaneen\n\nOur reception is open Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM`;
  }
  
  // Check hours queries
  if (lowerMessage.includes("hour") || lowerMessage.includes("open") || lowerMessage.includes("close")) {
    return `Our operating hours are:\n\n🏥 **Regular Hours**:\nMon-Fri: 8:00 AM - 8:00 PM\nSat-Sun: 9:00 AM - 5:00 PM\n\n🚨 **Emergency Department**: 24/7\n\n💊 **Pharmacy Hours**:\nMon-Fri: 8:00 AM - 7:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: 10:00 AM - 2:00 PM`;
  }
  
  // Use AI for other queries
  return await generateAIResponse(message);
}

async function generateAIResponse(message: string): Promise<string> {
  try {
    // If OpenAI is configured, use it
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful healthcare assistant for TZANEEN Healthcare Hub. Provide accurate, empathetic, and professional responses about healthcare services.
            
            About TZANEEN Healthcare Hub:
            - Located at 123 Healthcare Street, Tzaneen, Limpopo, South Africa
            - Phone: +27 15 307 3000, Emergency: +27 15 307 3111
            - Email: info@tzaneenhub.co.za
            - Operating hours: Mon-Fri 8AM-8PM, Sat-Sun 9AM-5PM, Emergency 24/7
            - Services: Emergency Care, Preventive Care, Family Medicine, Specialized Care
            - Specialists: Cardiologists, Neurologists, Pediatricians, Orthopedic Surgeons, Dermatologists, GPs
            - Insurance: Accept most medical aids including Discovery, Bonitas, Momentum
            
            If you don't know something, suggest contacting the facility directly. For emergencies, instruct to call emergency number immediately.
            Keep responses concise but helpful. Use emojis sparingly for emphasis.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again or contact us directly.";
    }
    
    // Fallback to rule-based responses
    return generateFallbackResponse(message);
    
  } catch (error) {
    console.error("OpenAI error:", error);
    return generateFallbackResponse(message);
  }
}

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Common healthcare questions
  const responses = [
    "I understand you have a healthcare question. For specific medical advice, please consult with one of our doctors directly.",
    "That's a great question about healthcare. You can find more information on our website or schedule a consultation with our specialists.",
    "I recommend speaking with our healthcare professionals about that. You can book an appointment online or call +27 15 307 3000.",
    "For accurate medical information, it's best to consult with our doctors. Would you like help booking an appointment?",
    "I'm here to help with healthcare information. Could you provide more details so I can assist you better?",
  ];
  
  // Check for symptoms or medical advice
  const symptomKeywords = [
    "pain", "fever", "cough", "headache", "nausea", "dizzy", 
    "rash", "bleeding", "infection", "symptom", "hurt"
  ];
  
  if (symptomKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "⚠️ **Important**: I cannot provide medical diagnoses. If you're experiencing symptoms, please:\n\n1. For emergencies, call +27 15 307 3111 immediately\n2. Schedule an appointment with a doctor\n3. Visit our emergency department if symptoms are severe\n\nYour health is important - please seek professional medical advice.";
  }
  
  // Default response
  return responses[Math.floor(Math.random() * responses.length)];
}