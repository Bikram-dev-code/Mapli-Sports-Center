import { cn } from "@/lib/utils";
import { Game } from "@/types/database";
import { AddGameDialog } from "./AddGameDialog";
import { Trophy, Gamepad2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GamesSidebarProps {
  games: Game[];
  selectedGameId: number | null;
  onSelectGame: (gameId: number) => void;
  onAddGame: (name: string) => void;
  onDeleteGame: (gameId: number) => void;
  isLoading: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function GamesSidebar({
  games,
  selectedGameId,
  onSelectGame,
  onAddGame,
  onDeleteGame,
  isLoading,
  isCollapsed,
  onToggleCollapse,
}: GamesSidebarProps) {
  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Sports Week</h1>
              <p className="text-xs text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-accent"
        onClick={onToggleCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Games List */}
      <div className="flex-1 overflow-y-auto p-3">
        {!isCollapsed && (
          <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Games
          </p>
        )}
        <nav className="space-y-1">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))
          ) : games.length === 0 ? (
            !isCollapsed && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Gamepad2 className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No games yet</p>
                <p className="text-xs text-muted-foreground/70">Add your first game below</p>
              </div>
            )
          ) : (
            games.map((game) => (
              <div key={game.id} className="group relative">
                <button
                  onClick={() => onSelectGame(game.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    selectedGameId === game.id
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                      selectedGameId === game.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    <Gamepad2 className="h-4 w-4" />
                  </div>
                  {!isCollapsed && (
                    <span className="truncate">{game.name}</span>
                  )}
                </button>
                {!isCollapsed && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {game.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this game and all its registered participants. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteGame(game.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))
          )}
        </nav>
      </div>

      {/* Add Game Button */}
      <div className={cn("border-t border-border p-3", isCollapsed && "px-2")}>
        {isCollapsed ? (
          <Button variant="sports" size="icon" className="w-full">
            <Gamepad2 className="h-4 w-4" />
          </Button>
        ) : (
          <AddGameDialog onAddGame={onAddGame} isLoading={isLoading} />
        )}
      </div>
    </aside>
  );
}
