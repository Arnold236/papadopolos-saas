import { 
  Heart, 
  Shield, 
  Users, 
  Stethoscope, 
  Brain, 
  Baby, 
  Bone, 
  Eye,
  Pill,
  Activity,
  Thermometer,
  Microscope,
  Syringe,
  Ambulance,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: Ambulance,
    title: "Emergency Care",
    description: "24/7 emergency medical services with rapid response and advanced life support",
    features: ["Trauma Center", "Cardiac Emergency", "Stroke Unit", "Pediatric Emergency"],
    color: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    icon: Heart,
    title: "Cardiology",
    description: "Comprehensive heart care including diagnostics, treatment, and rehabilitation",
    features: ["Echocardiography", "Cardiac Catheterization", "Pacemaker Implantation", "Cardiac Rehabilitation"],
    color: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Expert care for brain and nervous system disorders",
    features: ["EEG Monitoring", "Stroke Management", "Epilepsy Treatment", "Movement Disorders"],
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized healthcare for infants, children, and adolescents",
    features: ["Vaccinations", "Growth Monitoring", "Child Psychology", "Neonatal Care"],
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description: "Bone, joint, and muscle treatments including surgical and non-surgical options",
    features: ["Joint Replacement", "Sports Medicine", "Fracture Care", "Spine Surgery"],
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Complete eye care from routine checkups to advanced surgeries",
    features: ["Cataract Surgery", "LASIK", "Glaucoma Treatment", "Retinal Care"],
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Comprehensive primary healthcare for all ages",
    features: ["Preventive Care", "Chronic Disease Management", "Health Screenings", "Vaccinations"],
    color: "bg-gray-50",
    iconColor: "text-gray-600",
  },
  {
    icon: Pill,
    title: "Pharmacy Services",
    description: "In-house pharmacy with prescription services and medication counseling",
    features: ["Medication Dispensing", "Drug Information", "Compounding Services", "Home Delivery"],
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Activity,
    title: "Physical Therapy",
    description: "Rehabilitation services for injury recovery and mobility improvement",
    features: ["Sports Rehabilitation", "Post-Surgical Therapy", "Pain Management", "Mobility Training"],
    color: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    icon: Thermometer,
    title: "Diagnostic Services",
    description: "Advanced laboratory and imaging services for accurate diagnosis",
    features: ["MRI & CT Scan", "X-ray", "Ultrasound", "Laboratory Testing"],
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Microscope,
    title: "Pathology",
    description: "Comprehensive laboratory services for disease diagnosis",
    features: ["Blood Tests", "Histopathology", "Microbiology", "Genetic Testing"],
    color: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    icon: Users,
    title: "Mental Health",
    description: "Compassionate care for psychological wellbeing and mental health disorders",
    features: ["Counseling", "Psychiatric Evaluation", "Therapy Sessions", "Stress Management"],
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
];

const specializedServices = [
  {
    title: "Telemedicine",
    description: "Virtual consultations with specialists from the comfort of your home",
    icon: "💻",
  },
  {
    title: "Health Check Packages",
    description: "Comprehensive health screening packages for individuals and families",
    icon: "📋",
  },
  {
    title: "Corporate Wellness",
    description: "Employee health programs and occupational medicine services",
    icon: "🏢",
  },
  {
    title: "Home Healthcare",
    description: "Medical care and nursing services delivered to your home",
    icon: "🏠",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Healthcare Services</h1>
            <p className="text-xl md:text-2xl mb-8">
              Comprehensive medical care across all specialties, delivered with compassion and expertise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/specialists">
                <Button size="lg" className="bg-white text-[#00BFFF] hover:bg-gray-100">
                  Find a Specialist
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Medical Specialties</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Expert care across a wide range of medical disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:border-[#00BFFF]/20"
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <Shield className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/specialists?specialty=${service.title.toLowerCase()}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Find Specialist
                      </Button>
                    </Link>
                    <Link href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`} className="flex-1">
                      <Button size="sm" className="w-full bg-[#00BFFF] hover:bg-[#0099CC]">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Additional Services</h2>
            <p className="text-gray-600 text-xl">Innovative healthcare solutions for modern needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specializedServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Care Highlight */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-6">
                <Ambulance className="w-5 h-5 mr-2" />
                <span>24/7 Emergency Services</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Immediate Care When You Need It Most
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Our emergency department is staffed by experienced trauma specialists and equipped with state-of-the-art technology for critical care.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>Average response time: <strong>8 minutes</strong></span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>Board-certified emergency physicians</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3" />
                  <span>Level II Trauma Center certified</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-8xl mb-4">🚨</div>
              <h3 className="text-3xl font-bold mb-4">Emergency Contact</h3>
              <div className="text-4xl font-bold mb-4">+27 15 307 3111</div>
              <p className="text-xl mb-6">Available 24 hours a day, 7 days a week</p>
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100"
                onClick={() => window.location.href = "tel:+27153073111"}
              >
                Call Emergency Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Care Process</h2>
            <p className="text-gray-600 text-xl">Seamless healthcare experience from start to finish</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "Comprehensive evaluation and diagnosis by specialists",
                icon: "👨‍⚕️",
              },
              {
                step: "02",
                title: "Treatment Plan",
                description: "Personalized care plan developed with your input",
                icon: "📋",
              },
              {
                step: "03",
                title: "Treatment",
                description: "Expert medical care using advanced technology",
                icon: "💊",
              },
              {
                step: "04",
                title: "Follow-up",
                description: "Continuous care and monitoring for recovery",
                icon: "✅",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto">
                    <div className="text-4xl">{step.icon}</div>
                  </div>
                  <div className="absolute top-0 right-1/2 transform translate-x-1/2 md:translate-x-0 md:right-0 w-8 h-8 bg-[#00BFFF] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Take the Next Step?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule an appointment or consultation with our healthcare specialists today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Contact Us
                </Button>
              </Link>
              <Link href="/specialists">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Specialists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}