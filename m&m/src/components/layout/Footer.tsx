export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/lovable-uploads/bd67086d-ebfb-4971-a035-7a44098bbacb.png" 
              alt="MandM Autobody Specialist" 
              className="h-12 w-auto mb-4 filter brightness-0 invert"
            />
            <p className="text-gray-300 mb-4">
              Professional auto body repair and restoration services with over 20 years of experience. 
              We restore your vehicle to its original condition with precision and care.
            </p>
            <p className="text-gray-400 text-sm">REG:2022/443415/07</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Collision Repair</li>
              <li>Dent Removal</li>
              <li>Paint Services</li>
              <li>Frame Straightening</li>
              <li>Insurance Claims</li>
              <li>Vehicle Restoration</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>123 Auto Repair Lane</li>
              <li>Your City, State 12345</li>
              <li>(555) 123-4567</li>
              <li>info@mmautobody.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 MandM Autobody Specialist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};