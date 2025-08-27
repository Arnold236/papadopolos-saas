
import { Button } from "@/components/ui/button";
import { Car, Wrench } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-r from-yellow-100 to-yellow-200 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Professional Auto Body
              <span className="text-primary block">Restoration</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              MandM Autobody Specialist provides expert restoration of bodyworks with over 20 years of experience. 
              Trust us to bring your vehicle back to pristine condition.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Free Estimate
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Our Work
              </Button>
            </div>
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-gray-700">Expert Technicians</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="text-gray-700">Quality Guarantee</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Quote Today</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <textarea
                  placeholder="Describe the damage or service needed"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
                <Button className="w-full py-3">Submit Request</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};