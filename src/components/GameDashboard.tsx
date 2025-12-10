import { Game } from "@/types/database";
import { useParticipants } from "@/hooks/useParticipants";
import { ParticipantsTable } from "./ParticipantsTable";
import { RegisterParticipantDialog } from "./RegisterParticipantDialog";
import { Button } from "@/components/ui/button";
import { Download, Gamepad2, Users, Calendar } from "lucide-react";
import { exportToExcel } from "@/lib/exportToExcel";
import { format } from "date-fns";

interface GameDashboardProps {
  game: Game | null;
}

export function GameDashboard({ game }: GameDashboardProps) {
  const { participants, isLoading, addParticipant, deleteParticipant } = useParticipants(
    game?.id ?? null
  );

  if (!game) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Gamepad2 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
          Welcome to Sports Week
        </h2>
        <p className="max-w-md text-center text-muted-foreground">
          Select a game from the sidebar to view and manage participants, or add a new game to get started.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    if (participants.length === 0) {
      return;
    }
    exportToExcel(participants, game.name);
  };

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-card/50 px-8 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {game.name}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {participants.length} participant{participants.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Created {format(new Date(game.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={participants.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
            <RegisterParticipantDialog
              gameId={game.id}
              gameName={game.name}
              onRegister={(participant) => addParticipant.mutate(participant)}
              isLoading={addParticipant.isPending}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <ParticipantsTable
          participants={participants}
          isLoading={isLoading}
          onDeleteParticipant={(id) => deleteParticipant.mutate(id)}
        />
      </div>
    </div>
  );
}
