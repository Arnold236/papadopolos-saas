import { Search, Filter, Star, Award, Clock, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getSpecialists() {
  return await prisma.doctor.findMany({
    where: {
      available: true,
    },
    include: {
      user: true,
      reviews: {
        take: 10,
        where: {
          approved: true,
        },
      },
      availability: {
        where: {
          date: {
            gte: new Date(),
          },
          isAvailable: true,
        },
        take: 3,
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });
}

async function getSpecialties() {
  const specialties = await prisma.doctor.groupBy({
    by: ['specialty'],
    _count: {
      id: true,
    },
  });
  return specialties.map(s => s.specialty);
}

export default async function SpecialistsPage({
  searchParams,
}: {
  searchParams: { specialty?: string; search?: string };
}) {
  const [doctors, specialties] = await Promise.all([
    getSpecialists(),
    getSpecialties(),
  ]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = !searchParams.specialty || 
      doctor.specialty.toLowerCase().includes(searchParams.specialty.toLowerCase());
    
    const matchesSearch = !searchParams.search || 
      doctor.user.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchParams.search.toLowerCase());

    return matchesSpecialty && matchesSearch;
  });

  const averageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Our Medical Specialists</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Meet our team of highly qualified healthcare professionals dedicated to your wellbeing
            </p>
            
            {/* Search Bar */}
            <form action="/specialists" method="GET" className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search specialists by name or specialty..."
                  className="pl-12 pr-4 py-3 w-full rounded-full border-none shadow-lg"
                  defaultValue={searchParams.search}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#00BFFF] hover:bg-gray-100"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Filter className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                
                {/* Specialties */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Specialties</h4>
                  <div className="space-y-2">
                    <Link href="/specialists">
                      <Button
                        variant={!searchParams.specialty ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        All Specialties ({doctors.length})
                      </Button>
                    </Link>
                    {specialties.map((specialty) => (
                      <Link
                        key={specialty}
                        href={`/specialists?specialty=${encodeURIComponent(specialty)}`}
                      >
                        <Button
                          variant={searchParams.specialty === specialty ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          {specialty}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Next 24 Hours
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      This Week
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Telemedicine Available
                    </Button>
                  </div>
                </div>

                {/* Reset Filters */}
                {searchParams.specialty || searchParams.search ? (
                  <Link href="/specialists">
                    <Button variant="outline" className="w-full">
                      Clear Filters
                    </Button>
                  </Link>
                ) : null}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Specialists Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Specialists</span>
                    <span className="font-semibold">{doctors.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialties</span>
                    <span className="font-semibold">{specialties.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Experience</span>
                    <span className="font-semibold">
                      {Math.round(doctors.reduce((acc, doc) => acc + doc.experience, 0) / doctors.length)}+ years
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Specialists Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {searchParams.specialty ? searchParams.specialty : 'All'} Specialists
                </h2>
                <p className="text-gray-600">
                  {filteredDoctors.length} specialist{filteredDoctors.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Sort by: Experience</Button>
              </div>
            </div>

            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="group hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <img
                          src={doctor.avatar || "/api/placeholder/400/200"}
                          alt={doctor.user.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <Badge className="mb-2 bg-white/20 backdrop-blur-sm">
                            {doctor.specialty}
                          </Badge>
                          <h3 className="text-xl font-bold">{doctor.user.name}</h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-semibold">
                              {averageRating(doctor.reviews)}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                              ({doctor.reviews.length} reviews)
                            </span>
                          </div>
                          <Badge variant="outline">
                            <Award className="w-3 h-3 mr-1" />
                            {doctor.experience} years
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {doctor.bio || `Expert ${doctor.specialty.toLowerCase()} with ${doctor.experience} years of experience`}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Next available: {
                              doctor.availability.length > 0 
                                ? new Date(doctor.availability[0].date).toLocaleDateString()
                                : 'Check for slots'
                            }</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>Consultation: R{doctor.consultationFee}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/specialists/${doctor.id}`}
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full">
                              View Profile
                            </Button>
                          </Link>
                          <Link
                            href={`/contact?doctor=${doctor.id}`}
                            className="flex-1"
                          >
                            <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC]">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">No specialists found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Try different search terms or browse all specialties
                </p>
                <Link href="/specialists">
                  <Button>View All Specialists</Button>
                </Link>
              </div>
            )}

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-[#00BFFF]" />
                </div>
                <h4 className="font-bold mb-2">Board Certified</h4>
                <p className="text-gray-600 text-sm">
                  All our specialists are certified by relevant medical boards
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#00BFFF]" />
                </div>
                <h4 className="font-bold mb-2">Flexible Appointments</h4>
                <p className="text-gray-600 text-sm">
                  Book appointments online 24/7 with real-time availability
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-[#00BFFF]" />
                </div>
                <h4 className="font-bold mb-2">Patient Reviews</h4>
                <p className="text-gray-600 text-sm">
                  Read genuine patient reviews before choosing your specialist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}