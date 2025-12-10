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
import { Plus } from "lucide-react";

interface AddGameDialogProps {
  onAddGame: (name: string) => void;
  isLoading: boolean;
}

export function AddGameDialog({ onAddGame, isLoading }: AddGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [gameName, setGameName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim()) {
      onAddGame(gameName.trim());
      setGameName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sports" size="sm" className="w-full">
          <Plus className="h-4 w-4" />
          Add New Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Game</DialogTitle>
            <DialogDescription>
              Enter the name of the sport or game you want to add to Sports Week.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Game Name</Label>
              <Input
                id="name"
                placeholder="e.g., Chess, Football, Badminton..."
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="h-11"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="sports" disabled={!gameName.trim() || isLoading}>
              {isLoading ? "Adding..." : "Add Game"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
