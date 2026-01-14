import { notFound } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Users,
  Shield,
  Award,
  Calendar,
  Phone,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getService(slug: string) {
  // Convert slug back to title format
  const title = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // In a real app, you'd fetch from database
  // This is a mock implementation
  const services: Record<string, any> = {
    "Emergency Care": {
      title: "Emergency Care",
      description: "24/7 emergency medical services with immediate attention for life-threatening conditions",
      icon: "🚨",
      color: "bg-red-50",
      textColor: "text-red-600",
      features: [
        "Trauma Center with advanced life support",
        "Stroke and cardiac emergency units",
        "Pediatric emergency specialists",
        "24/7 ambulance services",
        "Immediate diagnostic imaging",
        "Critical care specialists",
      ],
      process: [
        "Triage assessment within 5 minutes",
        "Immediate diagnostic tests",
        "Specialist consultation",
        "Treatment initiation",
        "Continuous monitoring",
        "Discharge or admission planning",
      ],
      specialists: ["Emergency Physicians", "Trauma Surgeons", "Cardiologists", "Neurologists"],
    },
    "Cardiology": {
      title: "Cardiology",
      description: "Comprehensive heart care including prevention, diagnosis, and treatment of cardiovascular diseases",
      icon: "❤️",
      color: "bg-red-50",
      textColor: "text-red-600",
      features: [
        "Echocardiography and stress testing",
        "Cardiac catheterization lab",
        "Pacemaker and ICD implantation",
        "Cardiac rehabilitation program",
        "Preventive cardiology",
        "Heart failure management",
      ],
      process: [
        "Cardiac risk assessment",
        "Non-invasive diagnostic tests",
        "Cardiac consultation",
        "Personalized treatment plan",
        "Minimally invasive procedures",
        "Long-term follow-up care",
      ],
      specialists: ["Cardiologists", "Cardiac Surgeons", "Electrophysiologists"],
    },
  };

  return services[title] || null;
}

export default async function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${service.color} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-6xl mb-6">{service.icon}</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{service.title}</h1>
            <p className="text-xl md:text-2xl mb-8">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/specialists">
                <Button size="lg" variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900/10">
                  Find Specialists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Comprehensive {service.title}</h2>
              <p className="text-gray-600 text-lg mb-8">
                Our {service.title.toLowerCase()} services provide expert care using the latest medical technology and evidence-based practices. We focus on both treatment and prevention to ensure long-term health outcomes.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Board-certified specialists</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>State-of-the-art equipment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Personalized treatment plans</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Multidisciplinary approach</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <img
                src={`https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80`}
                alt={service.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Clock className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <div className="font-bold">24/7</div>
                  <div className="text-sm text-gray-600">Availability</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Users className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <div className="font-bold">15+</div>
                  <div className="text-sm text-gray-600">Specialists</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Shield className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <div className="font-bold">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Award className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
                  <div className="font-bold">Level II</div>
                  <div className="text-sm text-gray-600">Trauma Center</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our {service.title} Features</h2>
            <p className="text-gray-600 text-xl">Comprehensive care with advanced technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.features.map((feature: string, index: number) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-0">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="w-6 h-6 text-[#00BFFF]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature}</h3>
                  <p className="text-gray-600">
                    Expert care delivered with compassion and precision using the latest medical advancements.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Care Process</h2>
            <p className="text-gray-600 text-xl">Step-by-step approach to your healthcare</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.process.map((step: string, index: number) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto">
                    <div className="text-2xl font-bold text-[#00BFFF]">{index + 1}</div>
                  </div>
                  {index < service.process.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-3/4 w-full h-0.5 bg-gray-200"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">Step {index + 1}</h3>
                <p className="text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our {service.title} Specialists</h2>
            <p className="text-gray-600 text-xl">Meet our team of expert healthcare professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.specialists.map((specialist: string, index: number) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${specialist}`}
                      alt={specialist}
                      className="w-full h-full"
                    />
                  </div>
                  <h3 className="font-bold mb-2">{specialist}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Expert in {service.title.toLowerCase()} with specialized training
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Schedule Your {service.title} Consultation?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today to book an appointment with our specialists
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-[#00BFFF] hover:bg-gray-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+27153073000">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now: +27 15 307 3000
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}