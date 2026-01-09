import { Camera, Users, Building, Heart, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";

async function getGalleryImages() {
  return await prisma.mediaGallery.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

async function getTeamMembers() {
  return await prisma.user.findMany({
    where: {
      role: { in: ["DOCTOR", "ADMIN"] },
      avatar: { not: null },
    },
    include: {
      doctor: true,
    },
    take: 12,
  });
}

async function getFacilityImages() {
  return await prisma.facilityImage.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function MediaPage() {
  const [galleryImages, teamMembers, facilityImages] = await Promise.all([
    getGalleryImages(),
    getTeamMembers(),
    getFacilityImages(),
  ]);

  const stats = [
    { icon: Users, value: "50+", label: "Healthcare Professionals" },
    { icon: Building, value: "15+", label: "Specialized Departments" },
    { icon: Heart, value: "10,000+", label: "Patients Treated" },
    { icon: Award, value: "25+", label: "Years of Excellence" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80"
            alt="Healthcare Facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/80 to-[#0099CC]/80" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
              <Camera className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Our Healthcare Space</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Welcome to TZANEEN Healthcare Hub - Where compassion meets cutting-edge medical care
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00BFFF]/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-[#00BFFF]" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="gallery" className="space-y-8">
          <div className="text-center">
            <TabsList className="inline-flex">
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
              <TabsTrigger value="facility">Facility Tour</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>

          {/* Photo Gallery */}
          <TabsContent value="gallery">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <Card key={image.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-600">{image.description}</p>
                    {image.category && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 text-xs bg-gray-100 rounded-full">
                          {image.category}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Our Team */}
          <TabsContent value="team">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative pt-8">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={member.avatar || "/api/placeholder/128/128"}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <CardContent className="pt-16 pb-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-[#00BFFF] font-medium mb-3">
                      {member.doctor?.specialty || "Healthcare Professional"}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {member.doctor?.bio || "Dedicated to providing exceptional patient care"}
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm" className="bg-[#00BFFF] hover:bg-[#0099CC]">
                        Book Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Departments */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Specialized Departments</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { name: "Cardiology", icon: "❤️", color: "bg-red-50" },
                  { name: "Neurology", icon: "🧠", color: "bg-blue-50" },
                  { name: "Pediatrics", icon: "👶", color: "bg-yellow-50" },
                  { name: "Orthopedics", icon: "🦴", color: "bg-green-50" },
                  { name: "Dermatology", icon: "✨", color: "bg-purple-50" },
                  { name: "Emergency", icon: "🚨", color: "bg-orange-50" },
                ].map((dept, idx) => (
                  <div
                    key={idx}
                    className={`${dept.color} rounded-2xl p-6 text-center group hover:shadow-lg transition-shadow`}
                  >
                    <div className="text-4xl mb-4">{dept.icon}</div>
                    <h3 className="font-semibold">{dept.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Facility Tour */}
          <TabsContent value="facility">
            <div className="space-y-12">
              {facilityImages.map((facility, index) => (
                <div
                  key={facility.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={facility.imageUrl}
                      alt={facility.title}
                      className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{facility.title}</h3>
                    <p className="text-gray-600 text-lg mb-6">{facility.description}</p>
                    <ul className="space-y-3">
                      {facility.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <Shield className="w-5 h-5 text-[#00BFFF] mr-3" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Virtual Tour */}
            <div className="mt-16 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] rounded-3xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Take a Virtual Tour</h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Explore our state-of-the-art facilities from the comfort of your home
              </p>
              <Button
                size="lg"
                className="bg-white text-[#00BFFF] hover:bg-gray-100 text-lg px-8"
              >
                Start Virtual Tour
              </Button>
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Events */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Upcoming Health Events</h3>
                <div className="space-y-6">
                  {[
                    {
                      title: "Free Health Screening Camp",
                      date: "March 15, 2024",
                      time: "9:00 AM - 4:00 PM",
                      description: "Free checkups for blood pressure, sugar, and BMI",
                      spots: "Limited spots available",
                    },
                    {
                      title: "Cardiac Health Awareness Workshop",
                      date: "March 22, 2024",
                      time: "2:00 PM - 5:00 PM",
                      description: "Learn about heart health and prevention",
                      spots: "Open to all",
                    },
                  ].map((event, idx) => (
                    <Card key={idx} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                          <div className="flex items-center text-gray-600 space-x-4">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <Button className="bg-[#00BFFF] hover:bg-[#0099CC]">
                          Register
                        </Button>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <p className="text-sm text-amber-600">{event.spots}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Past Events Gallery */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Past Events Gallery</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden group">
                      <img
                        src={`https://images.unsplash.com/photo-155160${1650 + i}?auto=format&fit=crop&w=800&q=80`}
                        alt={`Event ${i}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The care I received was exceptional. The staff was compassionate and professional.",
                name: "Sarah M.",
                treatment: "Cardiac Care",
                rating: 5,
              },
              {
                quote: "State-of-the-art facilities with a personal touch. Highly recommended!",
                name: "James K.",
                treatment: "Orthopedic Surgery",
                rating: 5,
              },
              {
                quote: "From emergency to recovery, the team was with me every step of the way.",
                name: "Lisa T.",
                treatment: "Neurology",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.treatment}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}