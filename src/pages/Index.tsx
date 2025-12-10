import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GamesSidebar } from "@/components/GamesSidebar";
import { GameDashboard } from "@/components/GameDashboard";
import { useGames } from "@/hooks/useGames";
import { useAuth } from "@/hooks/useAuth";
import { Game } from "@/types/database";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { games, loading: gamesLoading, addGame } = useGames();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Auto-select first game if none selected
    if (games.length > 0 && !selectedGame) {
      setSelectedGame(games[0]);
    }
    // Update selected game if it was modified
    if (selectedGame) {
      const updated = games.find((g) => g.id === selectedGame.id);
      if (updated) {
        setSelectedGame(updated);
      }
    }
  }, [games, selectedGame]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  if (authLoading || gamesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <GamesSidebar
        games={games}
        selectedGameId={selectedGame?.id ?? null}
        onSelectGame={setSelectedGame}
        onAddGame={addGame}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSignOut={handleSignOut}
      />
      <GameDashboard game={selectedGame} />
    </div>
  );
};

export default Index;
