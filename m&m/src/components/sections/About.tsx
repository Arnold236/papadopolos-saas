
import { Button } from "@/components/ui/button";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-r from-yellow-50 to-yellow-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              About MandM Autobody Specialist
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              With over two decades of experience in auto body repair and restoration, MandM Autobody Specialist 
              has built a reputation for excellence in the automotive industry. Our team of certified technicians 
              uses the latest tools and techniques to restore your vehicle to its original condition.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We are committed to providing quality workmanship, excellent customer service, and competitive 
              pricing. Every project we undertake reflects our dedication to precision and attention to detail.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-3xl font-bold text-primary mb-2">20+</h4>
                <p className="text-gray-600">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-primary mb-2">1000+</h4>
                <p className="text-gray-600">Vehicles Restored</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-primary mb-2">100%</h4>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-primary mb-2">24/7</h4>
                <p className="text-gray-600">Emergency Service</p>
              </div>
            </div>
            
            <Button size="lg">Learn More About Us</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600&h=400" 
              alt="Latest model luxury car" 
              className="rounded-lg shadow-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600&h=400" 
              alt="Modern sports car" 
              className="rounded-lg shadow-lg mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};