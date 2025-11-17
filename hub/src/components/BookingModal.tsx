import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  specialist: z.string().min(1, "Please select a specialist"),
  date: z.date({ required_error: "Please select a date" }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [date, setDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      bookingSchema.parse({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        specialist,
        date,
        notes: notes.trim(),
      });

      toast.success("Appointment request submitted!", {
        description: "We'll contact you shortly to confirm your appointment.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSpecialist("");
      setDate(undefined);
      setNotes("");
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please check the form for errors");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book an Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 XX XXX XXXX"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialist">Select Specialist *</Label>
            <Select value={specialist} onValueChange={setSpecialist}>
              <SelectTrigger className={errors.specialist ? "border-destructive" : ""}>
                <SelectValue placeholder="Choose a specialist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Practitioner</SelectItem>
                <SelectItem value="cardiology">Cardiologist</SelectItem>
                <SelectItem value="pediatrics">Pediatrician</SelectItem>
                <SelectItem value="orthopedics">Orthopedic Specialist</SelectItem>
                <SelectItem value="dermatology">Dermatologist</SelectItem>
              </SelectContent>
            </Select>
            {errors.specialist && <p className="text-sm text-destructive">{errors.specialist}</p>}
          </div>

          <div className="space-y-2">
            <Label>Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or requirements..."
              className="resize-none"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Submit Appointment Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
