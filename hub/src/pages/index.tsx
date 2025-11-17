import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpecialistCard } from "@/components/SpecialistCard";
import { BookingModal } from "@/components/BookingModal";
import ChatBot from "@/components/ChatBot";
import { Calendar, Clock, Phone, Mail, MapPin, Heart, Users, Stethoscope, Shield } from "lucide-react";
import logo from "@/assets/tzaneen-logo.png";
import specialistCardiology from "@/assets/specialist-cardiology.jpg";
import specialistPediatrics from "@/assets/specialist-pediatrics.jpg";
import specialistOrthopedics from "@/assets/specialist-orthopedics.jpg";
import specialistDermatology from "@/assets/specialist-dermatology.jpg";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  const specialists = [
    {
      name: "Dr. Sarah Mabunda",
      specialty: "General Practitioner",
      qualifications: "MBChB, FCFP",
      availability: "Mon-Fri: 8:00 AM - 5:00 PM",
      image: specialistDermatology,
    },
    {
      name: "Dr. John Maluleke",
      specialty: "Cardiologist",
      qualifications: "MBChB, FCP (SA), Cert Cardiology",
      availability: "Tue, Thu: 9:00 AM - 4:00 PM",
      image: specialistCardiology,
    },
    {
      name: "Dr. Lindiwe Chauke",
      specialty: "Pediatrician",
      qualifications: "MBChB, DCH, FCPaed",
      availability: "Mon-Wed-Fri: 8:00 AM - 3:00 PM",
      image: specialistPediatrics,
    },
    {
      name: "Dr. Michael Baloyi",
      specialty: "Orthopedic Specialist",
      qualifications: "MBChB, FCS (Orth)",
      availability: "Mon, Wed, Fri: 10:00 AM - 6:00 PM",
      image: specialistOrthopedics,
    },
  ];

  const services = [
    {
      icon: Stethoscope,
      title: "General Healthcare",
      description: "Comprehensive primary care services for all ages",
    },
    {
      icon: Heart,
      title: "Specialized Care",
      description: "Expert specialists across multiple medical fields",
    },
    {
      icon: Users,
      title: "Family Medicine",
      description: "Dedicated family healthcare and preventive services",
    },
    {
      icon: Shield,
      title: "Emergency Care",
      description: "24/7 emergency services for urgent medical needs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Tzaneen Healthcare Hub" className="h-12 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#specialists" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Specialists</a>
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Blog</Link>
            <Link to="/media" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Media</Link>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Contact</a>
            <Button onClick={() => setBookingOpen(true)} className="bg-accent hover:bg-accent/90">
              Book Appointment
            </Button>
          </div>
          <Button onClick={() => setBookingOpen(true)} className="md:hidden bg-accent hover:bg-accent/90">
            Book Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Health, <span className="text-primary">Our Priority</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive healthcare services with experienced specialists dedicated to your wellbeing. Quality care when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setBookingOpen(true)}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to meet your medical needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-border">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialists Section */}
      <section id="specialists" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Specialists</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet our team of qualified healthcare professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialists.map((specialist, index) => (
              <SpecialistCard key={index} {...specialist} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button 
              size="lg"
              onClick={() => setBookingOpen(true)}
              className="bg-accent hover:bg-accent/90"
            >
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              Get in touch with us for appointments or inquiries
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground">+27 15 307 3456</p>
                  <p className="text-muted-foreground">+27 82 555 1234</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">info@tzaneenhub.co.za</p>
                  <p className="text-muted-foreground">appointments@tzaneenhub.co.za</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground">Tzaneen Medical Centre</p>
                  <p className="text-muted-foreground">Limpopo, South Africa</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Operating Hours</h3>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Emergency Services Only</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Tzaneen Healthcare Hub" className="h-10 w-auto" />
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 Tzaneen Healthcare Hub. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Providing quality healthcare services to our community
          </p>
        </div>
      </footer>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <ChatBot />
    </div>
  );
};

export default Index;
