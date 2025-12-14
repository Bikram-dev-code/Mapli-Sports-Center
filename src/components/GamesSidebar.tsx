import { useState } from "react";
import { Game, NewGame } from "@/types/database";
import { AddGameDialog } from "./AddGameDialog";
import { EditGameDialog } from "./EditGameDialog";
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  LogOut,
  Pencil, // New icon for Edit
  Trash2, // New icon for Delete
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Needed for confirmation

interface GameUpdatePayload {
  id: number;
  name?: string;
  is_group_game?: boolean;
}

interface GamesSidebarProps {
  games: Game[];
  selectedGameId: number | null;
  onSelectGame: (game: Game) => void;
  onAddGame: (game: NewGame) => void;
  onUpdateGame: (payload: GameUpdatePayload) => Promise<boolean>;
  onDeleteGame: (id: number, name: string) => Promise<boolean>;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
}

export function GamesSidebar({
  games,
  selectedGameId,
  onSelectGame,
  onAddGame,
  onUpdateGame, // Destructured for use
  onDeleteGame, // Destructured for use
  collapsed,
  onToggleCollapse,
  onSignOut,
}: GamesSidebarProps) {
  // State for the Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  // State for the Delete Confirmation Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  // --- Handlers ---

  const handleEditClick = (game: Game) => {
    setGameToEdit(game);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = (updatedData: { name: string, is_group_game: boolean }) => {
    if (gameToEdit) {
      onUpdateGame({ id: gameToEdit.id, ...updatedData });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteConfirmation = (game: Game) => {
    setGameToDelete(game);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAction = () => {
    if (gameToDelete) {
      // The hook function already handles the actual Supabase call and toast feedback
      onDeleteGame(gameToDelete.id, gameToDelete.name);
      setIsDeleteDialogOpen(false);
      setGameToDelete(null); // Clear the state
    }
  };

  // --- Rendering ---

  return (
    <>
      <aside
        className={cn(
          "h-screen bg-card border-r flex flex-col transition-all duration-300 ease-in-out z-10 fixed",
          collapsed ? "w-16" : "w-72"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                {/* <Trophy className="h-5 w-5 text-primary-foreground" /> */}
            <img src="malp.png" alt="logo" className="rounded" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg leading-tight">Sports Week</h1>
                <p className="text-xs text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!collapsed && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
              Games
            </p>
          )}
          {games.map((game) => (
            <div
              key={game.id}
              className={cn(
                "group w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
                selectedGameId === game.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {/* Game Info - Clickable Area */}
              <button
                onClick={() => onSelectGame(game)}
                className={cn(
                    "flex items-center gap-3 text-left flex-1 truncate",
                    selectedGameId === game.id ? "text-primary-foreground" : "text-foreground"
                )}
                title={collapsed ? game.name : undefined}
                disabled={collapsed}
              >
                {game.is_group_game ? (
                  <Users className="h-4 w-4 shrink-0" />
                ) : (
                  <User className="h-4 w-4 shrink-0" />
                )}
                {!collapsed && (
                  <span className="truncate font-medium text-sm">{game.name}</span>
                )}
                {/* Collapsed view only shows icon, no text */}
                {collapsed && <span className="sr-only">{game.name}</span>}
              </button>
              
              {/* Action Buttons (Only visible when NOT collapsed, and on hover) */}
              {!collapsed && (
                <div 
                  className={cn(
                    "flex gap-1 ml-2 transition-opacity",
                    selectedGameId === game.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Edit Game" 
                    className={selectedGameId === game.id ? "text-primary-foreground hover:bg-primary/80" : "text-muted-foreground hover:text-foreground"}
                    onClick={(e) => { e.stopPropagation(); handleEditClick(game); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Delete Game" 
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={(e) => { e.stopPropagation(); handleDeleteConfirmation(game); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t space-y-2">
          {/* Add Game Button */}
          {!collapsed && <AddGameDialog onAddGame={onAddGame} />}
          
          {/* Sign Out Button */}
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2 text-muted-foreground hover:text-destructive", collapsed ? "h-10 w-10 p-0" : "h-9")}
            onClick={onSignOut}
            size={collapsed ? "icon" : "default"}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* --- MODALS/DIALOGS --- */}
      
      {/* 1. Edit Game Dialog */}
      {isEditDialogOpen && gameToEdit && (
        <EditGameDialog
          game={gameToEdit}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleUpdateSubmit} // This calls onUpdateGame prop
        />
      )}

      {/* 2. Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Confirm Permanent Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete the game **{gameToDelete?.name}**. This action is irreversible and **will permanently delete ALL associated participant data** due to foreign key constraints.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAction} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
