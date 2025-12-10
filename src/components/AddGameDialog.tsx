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
import { Switch } from "@/components/ui/switch";
import { Plus, Users, User } from "lucide-react";
import { NewGame } from "@/types/database";

interface AddGameDialogProps {
  onAddGame: (game: NewGame) => void;
}

export function AddGameDialog({ onAddGame }: AddGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isGroupGame, setIsGroupGame] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGame({ name: name.trim(), is_group_game: isGroupGame });
      setName("");
      setIsGroupGame(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sports" className="w-full gap-2 justify-start">
          <Plus className="h-4 w-4" />
          Add New Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Game</DialogTitle>
            <DialogDescription>
              Create a new game for Sports Week. Choose whether it's an individual or team game.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="game-name">Game Name</Label>
              <Input
                id="game-name"
                placeholder="e.g., Chess, Football, Badminton"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                {isGroupGame ? (
                  <Users className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="game-type" className="text-base cursor-pointer">
                    Team/Group Game
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isGroupGame ? "Teams with multiple members" : "Individual participants only"}
                  </p>
                </div>
              </div>
              <Switch
                id="game-type"
                checked={isGroupGame}
                onCheckedChange={setIsGroupGame}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="sports" disabled={!name.trim()}>
              Add Game
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
