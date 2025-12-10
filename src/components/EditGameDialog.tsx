// src/components/EditGameDialog.tsx

import React, { useState, useEffect } from 'react';
import { Game } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Assuming a Switch for the boolean toggle

interface EditGameDialogProps {
  game: Game;
  onClose: () => void;
  onSubmit: (updatedData: { name: string, is_group_game: boolean }) => void;
}

export const EditGameDialog: React.FC<EditGameDialogProps> = ({ game, onClose, onSubmit }) => {
  const [name, setName] = useState(game.name);
  const [isGroupGame, setIsGroupGame] = useState(game.is_group_game);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if the 'game' prop changes while the dialog is open (though unlikely)
  useEffect(() => {
    setName(game.name);
    setIsGroupGame(game.is_group_game);
  }, [game]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Call the onSubmit function passed from GamesSidebar
    // This function, in turn, calls the onUpdateGame prop (from the hook)
    onSubmit({ name, is_group_game: isGroupGame });
    
    // NOTE: The parent component should handle closing the dialog 
    // after the submission promise resolves (or fails)
    // For simplicity here, we assume the parent closes it, or you can adjust:
    // setIsSubmitting(false); // If you handle submission state feedback here
  };

  return (
    // Open the dialog, and close it when the overlay/X is clicked
    <Dialog open={true} onOpenChange={onClose}> 
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Game: {game.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            {/* Game Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gameName" className="text-right">
                Name
              </Label>
              <Input
                id="gameName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Group/Individual Toggle */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupToggle" className="text-right">
                Group Game
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Switch
                  id="groupToggle"
                  checked={isGroupGame}
                  onCheckedChange={setIsGroupGame}
                />
                <span className="text-sm text-muted-foreground">
                  {isGroupGame ? "(Team Registration)" : "(Individual Registration)"}
                </span>
              </div>
            </div>
            <p className="text-xs text-red-500 col-span-4 text-center">
              Changing this setting **does not** modify existing participant data.
            </p>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || name.trim() === ""}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};