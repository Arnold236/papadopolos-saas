import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
} from "lucide-react";

const footerLinks = {
  Services: [
    { href: "/services/emergency", label: "Emergency Care" },
    { href: "/services/cardiology", label: "Cardiology" },
    { href: "/services/neurology", label: "Neurology" },
    { href: "/services/pediatrics", label: "Pediatrics" },
    { href: "/services/telehealth", label: "Telehealth" },
  ],
  Specialists: [
    { href: "/specialists/cardiologists", label: "Cardiologists" },
    { href: "/specialists/neurologists", label: "Neurologists" },
    { href: "/specialists/pediatricians", label: "Pediatricians" },
    { href: "/specialists/orthopedics", label: "Orthopedic Surgeons" },
    { href: "/specialists/dermatologists", label: "Dermatologists" },
  ],
  Patients: [
    { href: "/patient-portal", label: "Patient Portal" },
    { href: "/medical-records", label: "Medical Records" },
    { href: "/billing", label: "Billing & Insurance" },
    { href: "/prescriptions", label: "Prescriptions" },
    { href: "/faq", label: "FAQ" },
  ],
  About: [
    { href: "/about", label: "About Us" },
    { href: "/leadership", label: "Leadership" },
    { href: "/careers", label: "Careers" },
    { href: "/news", label: "News & Updates" },
    { href: "/contact", label: "Contact Us" },
  ],
};

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#00BFFF] rounded-lg flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">TZANEEN Healthcare Hub</h2>
                <p className="text-gray-400">Your Health, Our Priority</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Providing comprehensive healthcare services with compassion and 
              expertise since 1998. Your trusted partner in health and wellness.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00BFFF] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#00BFFF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-[#00BFFF] mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Phone Numbers</h4>
              <p className="text-gray-400">
                Main: <a href="tel:+27153073000" className="hover:text-[#00BFFF]">+27 15 307 3000</a>
                <br />
                Emergency: <a href="tel:+27153073111" className="text-red-400 hover:text-red-300">+27 15 307 3111</a>
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-[#00BFFF] mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-gray-400">
                <a href="mailto:info@tzaneenhub.co.za" className="hover:text-[#00BFFF]">
                  info@tzaneenhub.co.za
                </a>
                <br />
                <a href="mailto:appointments@tzaneenhub.co.za" className="hover:text-[#00BFFF]">
                  appointments@tzaneenhub.co.za
                </a>
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-[#00BFFF] mt=1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Location</h4>
              <p className="text-gray-400">
                123 Healthcare Street
                <br />
                Tzaneen, Limpopo 0850
                <br />
                South Africa
              </p>
            </div>
          </div>
        </div>

        {/* Accreditation */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-3">Accreditations & Certifications</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Award className="w-5 h-5" />
                  <span>ISO 9001:2015 Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Users className="w-5 h-5" />
                  <span>Department of Health Accredited</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-gray-400 mb-2">
                <Clock className="w-5 h-5 inline-block mr-2" />
                Emergency Services: 24/7
              </div>
              <p className="text-sm text-gray-500">
                Pharmacy Hours: Mon-Fri 8AM-7PM, Sat 9AM-4PM, Sun 10AM-2PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} TZANEEN Healthcare Hub. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-[#00BFFF] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-[#00BFFF] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-400 hover:text-[#00BFFF] transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-400 hover:text-[#00BFFF] transition-colors"
              >
                Sitemap
              </Link>
              <a
                href="#top"
                className="text-gray-400 hover:text-[#00BFFF] transition-colors"
              >
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}