// src/components/EditIndividualDialog.tsx

import React, { useState } from 'react';
import { IndividualParticipant } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface EditIndividualDialogProps {
  participant: IndividualParticipant;
  onClose: () => void;
  onSubmit: (updatedData: { 
    full_name: string; 
    phone: string; 
    faculty: string; 
    semester: number; 
  }) => void;
}

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => i + 1);

export const EditIndividualDialog: React.FC<EditIndividualDialogProps> = ({ participant, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState(participant.full_name);
  const [phone, setPhone] = useState(participant.phone);
  const [faculty, setFaculty] = useState(participant.faculty);
  const [semester, setSemester] = useState(String(participant.semester));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone || !faculty || !semester) {
        toast.error("Please fill in all fields.");
        return;
    }
    
    setIsSubmitting(true);

    try {
        const updatedData = {
            full_name: fullName.trim(),
            phone: phone.trim(),
            faculty: faculty.trim(),
            semester: parseInt(semester, 10),
        };
        
        onSubmit(updatedData);
    } catch (error) {
        setIsSubmitting(false); // Enable button again on client-side error
        toast.error("An error occurred during form processing.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Participant Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            {/* Full Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="col-span-3"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
                type="tel"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Faculty */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="faculty" className="text-right">Faculty</Label>
              <Input
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="col-span-3"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Semester */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">Semester</Label>
              <div className="col-span-3">
                <Select value={semester} onValueChange={setSemester} disabled={isSubmitting} required>
                  <SelectTrigger id="semester" className="w-full">
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

          </div>
          <DialogFooter>
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