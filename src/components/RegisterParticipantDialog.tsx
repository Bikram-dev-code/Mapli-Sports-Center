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
import { UserPlus } from "lucide-react";
import { NewParticipant } from "@/types/database";

interface RegisterParticipantDialogProps {
  gameId: number;
  gameName: string;
  onRegister: (participant: NewParticipant) => void;
  isLoading: boolean;
}

export function RegisterParticipantDialog({
  gameId,
  gameName,
  onRegister,
  isLoading,
}: RegisterParticipantDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    student_id: "",
    phone: "",
    team_name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.full_name && formData.student_id && formData.phone) {
      onRegister({
        game_id: gameId,
        full_name: formData.full_name.trim(),
        student_id: formData.student_id.trim(),
        phone: formData.phone.trim(),
        team_name: formData.team_name.trim() || undefined,
      });
      setFormData({ full_name: "", student_id: "", phone: "", team_name: "" });
      setOpen(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isValid = formData.full_name && formData.student_id && formData.phone;

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
              Fill in the participant details to register for this game.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter participant's full name"
                value={formData.full_name}
                onChange={handleChange("full_name")}
                className="h-11"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID *</Label>
                <Input
                  id="student_id"
                  placeholder="e.g., STU2024001"
                  value={formData.student_id}
                  onChange={handleChange("student_id")}
                  className="h-11"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="team_name">Team Name (Optional)</Label>
              <Input
                id="team_name"
                placeholder="Enter team name if applicable"
                value={formData.team_name}
                onChange={handleChange("team_name")}
                className="h-11"
              />
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
