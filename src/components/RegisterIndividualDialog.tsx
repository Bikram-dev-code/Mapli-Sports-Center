import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { NewIndividualParticipant } from "@/types/database";

interface RegisterIndividualDialogProps {
  gameId: number;
  gameName: string;
  onRegister: (participant: NewIndividualParticipant) => void;
  isLoading: boolean;
}

export function RegisterIndividualDialog({
  gameId,
  gameName,
  onRegister,
  isLoading,
}: RegisterIndividualDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    faculty: "",
    semester: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.full_name && formData.phone && formData.faculty && formData.semester) {
      onRegister({
        game_id: gameId,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        faculty: formData.faculty.trim(),
        semester: parseInt(formData.semester),
      });
      setFormData({ full_name: "", phone: "", faculty: "", semester: "" });
      setOpen(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isValid = formData.full_name && formData.phone && formData.faculty && formData.semester;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sports" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Register Participant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Register for {gameName}</DialogTitle>
            <DialogDescription>
              Fill in the participant details for this individual game.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Participant Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={handleChange("full_name")}
                className="h-11"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="e.g., +1234567890"
                value={formData.phone}
                onChange={handleChange("phone")}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty *</Label>
                <Input
                  id="faculty"
                  placeholder="e.g., Engineering"
                  value={formData.faculty}
                  onChange={handleChange("faculty")}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="sports" disabled={!isValid || isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
