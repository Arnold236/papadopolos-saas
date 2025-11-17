import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpecialistCardProps {
  name: string;
  specialty: string;
  qualifications: string;
  availability: string;
  image?: string;
}

export const SpecialistCard = ({ name, specialty, qualifications, availability, image }: SpecialistCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card">
      {image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{specialty}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{qualifications}</p>
          <div className="pt-3 border-t border-border">
            <p className="text-sm font-medium text-foreground">Availability</p>
            <p className="text-sm text-muted-foreground">{availability}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
