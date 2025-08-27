import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/bd67086d-ebfb-4971-a035-7a44098bbacb.png" 
              alt="MandM Autobody Specialist" 
              className="h-12 w-auto"
            />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary">Home</a>
            <a href="#services" className="text-gray-700 hover:text-primary">Services</a>
            <a href="#about" className="text-gray-700 hover:text-primary">About</a>
            <a href="#contact" className="text-gray-700 hover:text-primary">Contact</a>
          </nav>

          <div className="hidden md:flex">
            <Button>Get Quote</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-primary">Home</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-primary">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary">Contact</a>
              <div className="px-3 py-2">
                <Button className="w-full">Get Quote</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};