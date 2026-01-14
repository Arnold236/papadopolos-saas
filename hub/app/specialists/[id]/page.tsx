import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Star,
  Users,
  BookOpen,
  GraduationCap,
  Languages,
  Shield,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getSpecialist(id: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: {
        where: { approved: true },
        include: {
          patient: true,
        },
        orderBy: { createdAt: "desc" },
      },
      workingHours: true,
      availability: {
        where: {
          date: {
            gte: new Date(),
          },
          isAvailable: true,
        },
        orderBy: { date: "asc" },
        take: 7,
      },
    },
  });

  if (!doctor) {
    notFound();
  }

  return doctor;
}

export default async function SpecialistPage({
  params,
}: {
  params: { id: string };
}) {
  const doctor = await getSpecialist(params.id);

  const averageRating = doctor.reviews.length > 0
    ? (doctor.reviews.reduce((acc, review) => acc + review.rating, 0) / doctor.reviews.length).toFixed(1)
    : "0.0";

  const upcomingAvailability = doctor.availability.slice(0, 3);

  const workingHours = doctor.workingHours.reduce((acc, wh) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    acc[days[wh.dayOfWeek]] = `${wh.startTime} - ${wh.endTime}`;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <Avatar className="w-40 h-40 border-4 border-white shadow-2xl">
              <AvatarImage src={doctor.avatar || ""} />
              <AvatarFallback className="text-4xl">
                {doctor.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-white/20 backdrop-blur-sm">
                  {doctor.specialty}
                </Badge>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-300 mr-1" />
                  <span className="font-bold text-xl">{averageRating}</span>
                  <span className="ml-2 text-white/80">
                    ({doctor.reviews.length} reviews)
                  </span>
                </div>
                <Badge variant="outline" className="border-white/30">
                  <Award className="w-3 h-3 mr-1" />
                  {doctor.experience} years experience
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-3">{doctor.user.name}</h1>
              <p className="text-xl mb-6 opacity-90 max-w-3xl">
                {doctor.bio || `Expert ${doctor.specialty.toLowerCase()} with ${doctor.experience} years of clinical experience`}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-[#00BFFF] hover:bg-gray-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4">About Dr. {doctor.user.name.split(' ').pop()}</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4">
                        {doctor.bio || `Dr. ${doctor.user.name.split(' ').pop()} is a highly experienced ${doctor.specialty.toLowerCase()} with ${doctor.experience} years of clinical practice. He completed his medical training at prestigious institutions and has been serving the Tzaneen community with dedication and expertise.`}
                      </p>
                      <p className="text-gray-700">
                        Specializing in comprehensive patient care, Dr. {doctor.user.name.split(' ').pop()} believes in a holistic approach to healthcare, combining advanced medical treatments with personalized attention to each patient's unique needs.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Qualifications */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <GraduationCap className="w-6 h-6 mr-2" />
                      Qualifications & Education
                    </h3>
                    <div className="space-y-4">
                      {doctor.qualifications.map((qualification, idx) => (
                        <div key={idx} className="flex items-start">
                          <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{qualification}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Areas of Expertise */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Diagnosis & Treatment",
                        "Preventive Care",
                        "Chronic Disease Management",
                        "Health Screenings",
                        "Patient Education",
                        "Follow-up Care",
                      ].map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Experience */}
              <TabsContent value="experience" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-6">Professional Experience</h3>
                    <div className="space-y-6">
                      <div className="border-l-4 border-[#00BFFF] pl-6 py-2">
                        <h4 className="font-bold text-lg">Senior Consultant</h4>
                        <p className="text-gray-600">TZANEEN Healthcare Hub • {doctor.experience} years</p>
                        <p className="text-gray-700 mt-2">
                          Leading specialist in {doctor.specialty.toLowerCase()} department, responsible for complex cases and mentoring junior doctors.
                        </p>
                      </div>
                      <div className="border-l-4 border-gray-300 pl-6 py-2">
                        <h4 className="font-bold text-lg">Consultant Physician</h4>
                        <p className="text-gray-600">Previous Hospital • 8 years</p>
                        <p className="text-gray-700 mt-2">
                          Served as attending physician in internal medicine department with focus on patient care and clinical research.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Patient Reviews</h3>
                      <Button variant="outline">Write a Review</Button>
                    </div>
                    
                    {doctor.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {doctor.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Avatar className="w-10 h-10 mr-3">
                                  <AvatarImage src={review.patient?.avatar} />
                                  <AvatarFallback>
                                    {review.patient?.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{review.patient?.name || "Anonymous"}</h4>
                                  <p className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">No reviews yet</h4>
                        <p className="text-gray-600 mb-4">
                          Be the first to share your experience with Dr. {doctor.user.name.split(' ').pop()}
                        </p>
                        <Button>Write First Review</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Availability */}
              <TabsContent value="availability" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-6">Available Time Slots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {upcomingAvailability.map((slot, idx) => (
                        <Card key={idx} className="hover:border-[#00BFFF] transition-colors">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-lg font-bold mb-1">
                                {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="text-2xl font-bold text-[#00BFFF] mb-2">
                                {new Date(slot.date).getDate()}
                              </div>
                              <div className="text-sm text-gray-600 mb-4">
                                {new Date(slot.date).toLocaleDateString('en-US', { month: 'long' })}
                              </div>
                              <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC]">
                                <Clock className="w-4 h-4 mr-2" />
                                View Slots
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Booking */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Book an Appointment</h3>
                <div className="space-y-4">
                  <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC]">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Online
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call to Book: +27 15 307 3000
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>Emergency: +27 15 307 3111</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{doctor.user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>Room 204, Main Building</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Fee */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Consultation Fee</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-[#00BFFF]">R{doctor.consultationFee}</div>
                  <div className="text-gray-600">Initial consultation (45-60 mins)</div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Medical aid accepted. Follow-up consultations: R{Math.round(doctor.consultationFee * 0.7)}
                </p>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Working Hours
                </h3>
                <div className="space-y-3">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Languages className="w-4 h-4 mr-2" />
                  Languages Spoken
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["English", "Afrikaans", "Sepedi", "Xitsonga"].map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share Profile */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Share Profile</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Specialists */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Other {doctor.specialty} Specialists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would fetch related specialists from the same specialty */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`/api/placeholder/64/64`} />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold">Dr. Related Specialist</h4>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-sm">4.8 (42 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}