import { Heart, Shield, Users, Award, Target, Clock, Globe, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "Every decision we make revolves around what's best for our patients' health and wellbeing.",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Maintaining the highest standards of safety and hygiene in all our facilities and procedures.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Users,
    title: "Collaborative Approach",
    description: "Team-based care where specialists work together for comprehensive treatment plans.",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Commitment to medical excellence through continuous learning and innovation.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
];

const milestones = [
  { year: "1998", title: "Foundation", description: "TZANEEN Healthcare Hub founded with 3 specialists" },
  { year: "2005", title: "Expansion", description: "Opened new wing with advanced surgical facilities" },
  { year: "2012", title: "Technology", description: "Implemented electronic health records system" },
  { year: "2018", title: "Accreditation", description: "Received national healthcare excellence award" },
  { year: "2023", title: "Innovation", description: "Launched telemedicine and AI-assisted diagnostics" },
];

const leadershipTeam = [
  {
    name: "Dr. Thabo Mbeki",
    role: "Medical Director",
    specialty: "Cardiovascular Surgery",
    experience: "25+ years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Naledi Smith",
    role: "Head of Operations",
    specialty: "Healthcare Management",
    experience: "18+ years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  },
  {
    name: "Prof. James Khumalo",
    role: "Chief of Medical Staff",
    specialty: "Internal Medicine",
    experience: "30+ years",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80"
            alt="Healthcare team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/90 to-[#0099CC]/80" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our Story: <span className="text-yellow-300">25 Years</span> of Healing Excellence
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                From a small clinic to Tzaneen's premier healthcare destination, our journey is defined by compassion, innovation, and unwavering commitment to our community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-[#00BFFF] hover:bg-gray-100">
                  Meet Our Team
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Our Facilities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-[#00BFFF]/10 rounded-full mb-6">
                <Target className="w-5 h-5 text-[#00BFFF] mr-2" />
                <span className="font-semibold text-[#00BFFF]">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                To provide exceptional, accessible healthcare that transforms lives
              </h2>
              <p className="text-gray-600 text-lg">
                We strive to deliver comprehensive medical care with compassion, using cutting-edge technology while maintaining the personal touch that makes each patient feel valued and heard.
              </p>
            </div>
            
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
                <Globe className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-semibold text-purple-600">Our Vision</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Leading healthcare innovation for a healthier Limpopo
              </h2>
              <p className="text-gray-600 text-lg">
                We envision a future where every resident of Tzaneen and surrounding areas has access to world-class healthcare services, preventive medicine, and wellness programs that promote long-term health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              The principles that guide every decision and interaction at TZANEEN Healthcare Hub
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow border-0">
                <CardContent className="pt-8 pb-8">
                  <div className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <value.icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey Through Time</h2>
            <p className="text-gray-600 text-xl">Milestones that shaped our healthcare legacy</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00BFFF] to-[#0099CC]"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  {/* Content */}
                  <div
                    className={`w-5/12 ${index % 2 === 0 ? "text-right pr-12" : "text-left pl-12"}`}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-3xl font-bold text-[#00BFFF] mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Dot on timeline */}
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-white border-4 border-[#00BFFF] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Experienced professionals guiding our mission of excellence in healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((leader, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/30 mb-6">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                  <p className="text-[#00BFFF] font-semibold mb-1">{leader.role}</p>
                  <p className="opacity-90 mb-2">{leader.specialty}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{leader.experience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#00BFFF] mb-2">25+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#00BFFF] mb-2">50+</div>
              <div className="text-gray-600">Specialists</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#00BFFF] mb-2">100k+</div>
              <div className="text-gray-600">Patients Served</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#00BFFF] mb-2">98%</div>
              <div className="text-gray-600">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-6">
              <Star className="w-5 h-5 text-yellow-300 mr-2" />
              <span>Join Our Healthcare Family</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Experience the difference of compassionate, expert care
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Whether you need routine checkups, specialized treatment, or emergency care, we're here for you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Contact Us Today
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}