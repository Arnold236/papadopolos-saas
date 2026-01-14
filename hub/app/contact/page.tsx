"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const departments = [
  { name: "General Inquiries", email: "info@tzaneenhub.co.za", phone: "+27 15 307 3000" },
  { name: "Appointments", email: "appointments@tzaneenhub.co.za", phone: "+27 15 307 3001" },
  { name: "Emergency", email: "emergency@tzaneenhub.co.za", phone: "+27 15 307 3111" },
  { name: "Billing", email: "billing@tzaneenhub.co.za", phone: "+27 15 307 3002" },
  { name: "Medical Records", email: "records@tzaneenhub.co.za", phone: "+27 15 307 3003" },
];

const emergencyContacts = [
  { name: "Emergency Department", phone: "+27 15 307 3111" },
  { name: "Ambulance Services", phone: "10177" },
  { name: "Poison Control", phone: "+27 86 155 5777" },
  { name: "Mental Health Crisis", phone: "+27 86 132 2322" },
];

const faqs = [
  {
    question: "What are your operating hours?",
    answer: "Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM. Emergency services are available 24/7.",
  },
  {
    question: "Do I need an appointment?",
    answer: "For non-emergency visits, appointments are recommended to reduce waiting time. Walk-ins are welcome but may experience longer wait times.",
  },
  {
    question: "What documents should I bring?",
    answer: "Please bring your ID, medical aid card (if applicable), and any previous medical records or prescriptions.",
  },
  {
    question: "Do you accept medical aid?",
    answer: "Yes, we accept most major medical aids including Discovery, Bonitas, Momentum, and GEMS. Please confirm with your provider.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: "General Inquiries",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
        variant: "default",
      });
      
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        department: "General Inquiries",
      });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We're here to help. Reach out to us for appointments, inquiries, or emergency assistance.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Main Contact */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#00BFFF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Visit Us</h3>
                      <p className="text-gray-600">
                        123 Healthcare Street
                        <br />
                        Tzaneen, Limpopo 0850
                        <br />
                        South Africa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#00BFFF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-gray-600">
                        <a href="tel:+27153073000" className="hover:text-[#00BFFF]">
                          +27 15 307 3000
                        </a>
                        <br />
                        Emergency:{" "}
                        <a href="tel:+27153073111" className="text-red-600 hover:text-red-700 font-semibold">
                          +27 15 307 3111
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#00BFFF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:info@tzaneenhub.co.za" className="hover:text-[#00BFFF]">
                          info@tzaneenhub.co.za
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#00BFFF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Operating Hours</h3>
                      <p className="text-gray-600">
                        Mon-Fri: 8:00 AM - 8:00 PM
                        <br />
                        Sat-Sun: 9:00 AM - 5:00 PM
                        <br />
                        <span className="font-semibold">Emergency: 24/7</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-red-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <Phone className="w-4 h-4 text-red-600" />
                  </div>
                  Emergency Contacts
                </h3>
                <div className="space-y-3">
                  {emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">{contact.name}</span>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-red-700 mt-4">
                  🚨 For life-threatening emergencies, call our Emergency Department immediately.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                    <p className="text-gray-600 mb-6">
                      Fill out the form below and we'll respond as soon as possible.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+27 12 345 6789"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                          >
                            {departments.map((dept) => (
                              <option key={dept.name} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Please provide details about your inquiry..."
                          className="resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#00BFFF] hover:bg-[#0099CC]"
                        disabled={loading}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Departments Contact */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Contact Specific Departments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept) => (
                  <Card key={dept.name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">{dept.name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <a
                            href={`mailto:${dept.email}`}
                            className="hover:text-[#00BFFF] truncate"
                          >
                            {dept.email}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <a
                            href={`tel:${dept.phone}`}
                            className="hover:text-[#00BFFF]"
                          >
                            {dept.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Find Us</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.548112636733!2d30.16324217582831!3d-23.430820455761668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ec6c9e8a4d4b8b5%3A0x1c5b5b5b5b5b5b5b!2sTzaneen%2C%20Limpopo%2C%20South%20Africa!5e0!3m2!1sen!2sza!4v1702021234567!5m2!1sen!2sza"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold mb-2">Directions & Parking</h4>
                    <p className="text-gray-600">
                      We're located in central Tzaneen with ample parking. Look for our main entrance with the blue healthcare hub signage. Free patient parking is available in the front lot.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}