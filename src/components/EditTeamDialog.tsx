// src/components/EditTeamDialog.tsx

import React, { useState, useEffect } from 'react';
import { Team } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Minus, Users } from 'lucide-react';

// Define the structure for a single team member
interface TeamMember {
  name: string;
  phone: string;
}

interface EditTeamDialogProps {
  team: Team;
  onClose: () => void;
  // The onSubmit handler receives the updated data object
  onSubmit: (updatedData: { 
    team_name: string; 
    captain_faculty: string; 
    captain_semester: number;
    team_members: TeamMember[]; // This is the crucial JSONB array
  }) => void;
}

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => i + 1);

export const EditTeamDialog: React.FC<EditTeamDialogProps> = ({ team, onClose, onSubmit }) => {
  // Team Data State
  const [teamName, setTeamName] = useState(team.team_name);
  const [captainFaculty, setCaptainFaculty] = useState(team.captain_faculty);
  const [captainSemester, setCaptainSemester] = useState(String(team.captain_semester));
  
  // Dynamic Team Members State (parsed from the JSONB array)
  const [members, setMembers] = useState<TeamMember[]>(team.team_members || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Dynamic Member Handlers ---

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: '', phone: '' }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    } else {
      toast.warning("A team must have at least one member.");
    }
  };

  // --- Submission Handler ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!teamName || !captainFaculty || !captainSemester) {
      toast.error("Please fill in the main team details.");
      return;
    }
    
    // Check if all members have names/phones filled
    const membersValid = members.every(m => m.name.trim() !== '' && m.phone.trim() !== '');
    if (!membersValid) {
      toast.error("Please ensure all team members have a name and phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedData = {
        team_name: teamName.trim(),
        captain_faculty: captainFaculty.trim(),
        captain_semester: parseInt(captainSemester, 10),
        team_members: members, // Pass the array directly
      };
      
      onSubmit(updatedData);
      // Parent component handles the closing
    } catch (error) {
      setIsSubmitting(false);
      toast.error("An error occurred during form processing.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team: {team.team_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            
            {/* --- CAPTAIN/TEAM DETAILS --- */}
            <h4 className="text-lg font-semibold border-b pb-1 flex items-center gap-2">
              <Users className='h-5 w-5'/> Team Information
            </h4>
            
            {/* Team Name */}
            <div className="grid md:grid-cols-3 items-center gap-4">
              <Label htmlFor="teamName" className="md:col-span-1">Team Name</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="md:col-span-2"
                disabled={isSubmitting}
                required
              />
            </div>
            
            {/* Faculty and Semester */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="captainFaculty">Captain's Faculty</Label>
                <Input
                  id="captainFaculty"
                  value={captainFaculty}
                  onChange={(e) => setCaptainFaculty(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="captainSemester">Captain's Semester</Label>
                <Select value={captainSemester} onValueChange={setCaptainSemester} disabled={isSubmitting} required>
                  <SelectTrigger id="captainSemester">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_OPTIONS.map((s) => (
                      <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* --- TEAM MEMBERS LIST --- */}
            <h4 className="text-lg font-semibold border-b pb-1 mt-4">Team Members</h4>
            
            {members.map((member, index) => (
              <div key={index} className="grid md:grid-cols-10 gap-3 items-center p-3 border rounded-lg bg-gray-50">
                <div className="md:col-span-4">
                  <Label className="text-xs text-muted-foreground">Member Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    disabled={isSubmitting}
                    placeholder={`Member ${index + 1} Name`}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <Input
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                    disabled={isSubmitting}
                    type="tel"
                    placeholder={`Member ${index + 1} Phone`}
                    required
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeMember(index)}
                    disabled={isSubmitting || members.length <= 1}
                    title="Remove Member"
                  >
                    <Minus className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Add Member Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              disabled={isSubmitting}
              className="mt-2 gap-2"
            >
              <Plus className="h-4 w-4" /> Add Team Member
            </Button>
            
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};