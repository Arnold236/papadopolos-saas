import { Metadata } from "next";
import { ConsultationBooking } from "@/components/telehealth/ConsultationBooking";

export const metadata: Metadata = {
  title: "Book Telehealth Consultation | TZANEEN Healthcare Hub",
  description: "Schedule virtual consultations with our healthcare specialists",
};

export default function BookTelehealthPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ConsultationBooking />
      </div>
    </div>
  );
}