import { useState } from "react";
import { useGames } from "@/hooks/useGames";
import { GamesSidebar } from "@/components/GamesSidebar";
import { GameDashboard } from "@/components/GameDashboard";

const Index = () => {
  const { games, isLoading, addGame, deleteGame } = useGames();
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;

  const handleAddGame = (name: string) => {
    addGame.mutate({ name });
  };

  const handleDeleteGame = (gameId: number) => {
    deleteGame.mutate(gameId);
    if (selectedGameId === gameId) {
      setSelectedGameId(null);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <GamesSidebar
        games={games}
        selectedGameId={selectedGameId}
        onSelectGame={setSelectedGameId}
        onAddGame={handleAddGame}
        onDeleteGame={handleDeleteGame}
        isLoading={isLoading}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 overflow-hidden">
        <GameDashboard game={selectedGame} />
      </main>
    </div>
  );
};

export default Index;
