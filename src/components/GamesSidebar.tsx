import { Game } from "@/types/database";
import { AddGameDialog } from "./AddGameDialog";
import { NewGame } from "@/types/database";
import { Trophy, ChevronLeft, ChevronRight, User, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GamesSidebarProps {
  games: Game[];
  selectedGameId: number | null;
  onSelectGame: (game: Game) => void;
  onAddGame: (game: NewGame) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
}

export function GamesSidebar({
  games,
  selectedGameId,
  onSelectGame,
  onAddGame,
  collapsed,
  onToggleCollapse,
  onSignOut,
}: GamesSidebarProps) {
  return (
    <aside
      className={cn(
        "h-screen bg-card border-r flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="h-5 w-5 text-primary-foreground" />
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

      {/* Games List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!collapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
            Games
          </p>
        )}
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left",
              selectedGameId === game.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted text-foreground"
            )}
            title={collapsed ? game.name : undefined}
          >
            {game.is_group_game ? (
              <Users className="h-4 w-4 shrink-0" />
            ) : (
              <User className="h-4 w-4 shrink-0" />
            )}
            {!collapsed && (
              <span className="truncate font-medium text-sm">{game.name}</span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        {!collapsed ? (
          <>
            <AddGameDialog onAddGame={onAddGame} />
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="w-full text-muted-foreground hover:text-destructive"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
