
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench, Shield, Settings, Zap, Gauge, Clock, Award, Truck, Hammer, Cog, CheckCircle } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Car,
      title: "Collision Repair",
      description: "Complete collision repair services to restore your vehicle's safety and appearance."
    },
    {
      icon: Wrench,
      title: "Dent Removal",
      description: "Professional paintless dent repair and traditional dent removal services."
    },
    {
      icon: Car,
      title: "Paint Services",
      description: "Expert automotive painting with color matching and protective coatings."
    },
    {
      icon: Wrench,
      title: "Frame Straightening",
      description: "Precision frame straightening using state-of-the-art equipment."
    },
    {
      icon: Car,
      title: "Insurance Claims",
      description: "We work directly with insurance companies to streamline your claim process."
    },
    {
      icon: Wrench,
      title: "Restoration",
      description: "Complete vehicle restoration services for classic and vintage automobiles."
    },
    {
      icon: Shield,
      title: "Rust Repair",
      description: "Professional rust removal and prevention treatments to protect your vehicle."
    },
    {
      icon: Settings,
      title: "Bumper Repair",
      description: "Expert bumper repair and replacement services for all vehicle types."
    },
    {
      icon: Zap,
      title: "Scratch Repair",
      description: "Professional scratch removal and paint touch-up services."
    },
    {
      icon: Gauge,
      title: "Window Tinting",
      description: "High-quality window tinting services for comfort and privacy."
    },
    {
      icon: Clock,
      title: "Emergency Service",
      description: "24/7 emergency towing and repair services when you need them most."
    },
    {
      icon: Award,
      title: "Quality Inspection",
      description: "Comprehensive vehicle inspections to ensure safety and performance standards."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive auto body repair and restoration services with attention to detail and quality craftsmanship.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};