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
import { UserPlus, Plus, Trash2 } from "lucide-react";
import { NewTeam, TeamMember } from "@/types/database";

interface RegisterTeamDialogProps {
  gameId: number;
  gameName: string;
  onRegister: (team: NewTeam) => void;
  isLoading: boolean;
}

export function RegisterTeamDialog({
  gameId,
  gameName,
  onRegister,
  isLoading,
}: RegisterTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [captainFaculty, setCaptainFaculty] = useState("");
  const [captainSemester, setCaptainSemester] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([{ name: "", phone: "" }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMembers = members.filter((m) => m.name.trim() && m.phone.trim());
    
    if (teamName && captainFaculty && captainSemester && validMembers.length > 0) {
      onRegister({
        game_id: gameId,
        team_name: teamName.trim(),
        team_members: validMembers.map((m) => ({
          name: m.name.trim(),
          phone: m.phone.trim(),
        })),
        captain_faculty: captainFaculty.trim(),
        captain_semester: parseInt(captainSemester),
      });
      resetForm();
      setOpen(false);
    }
  };

  const resetForm = () => {
    setTeamName("");
    setCaptainFaculty("");
    setCaptainSemester("");
    setMembers([{ name: "", phone: "" }]);
  };

  const addMember = () => {
    setMembers([...members, { name: "", phone: "" }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const validMembers = members.filter((m) => m.name.trim() && m.phone.trim());
  const isValid = teamName && captainFaculty && captainSemester && validMembers.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sports" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Register Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-scale-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Register Team for {gameName}</DialogTitle>
            <DialogDescription>
              Enter team details and add all team members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="team_name">Team Name *</Label>
              <Input
                id="team_name"
                placeholder="e.g., Rajesh Dai Ko Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="h-11"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="captain_faculty">Captain's Faculty *</Label>
                <Input
                  id="captain_faculty"
                  placeholder="e.g., BCSIT"
                  value={captainFaculty}
                  onChange={(e) => setCaptainFaculty(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="captain_semester">Captain's Semester *</Label>
                <Select value={captainSemester} onValueChange={setCaptainSemester}>
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Team Members *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMember} className="gap-1">
                  <Plus className="h-3 w-3" />
                  Add Member
                </Button>
              </div>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 rounded-lg border bg-muted/20">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Member name"
                        value={member.name}
                        onChange={(e) => updateMember(index, "name", e.target.value)}
                        className="h-10"
                      />
                      <Input
                        placeholder="Phone number"
                        value={member.phone}
                        onChange={(e) => updateMember(index, "phone", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(index)}
                      disabled={members.length === 1}
                      className="h-10 w-10 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {validMembers.length} member{validMembers.length !== 1 ? "s" : ""} added
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="sports" disabled={!isValid || isLoading}>
              {isLoading ? "Registering..." : "Register Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
