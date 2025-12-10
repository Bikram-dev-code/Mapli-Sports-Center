import { useState } from "react";
import { Game, IndividualParticipant, Team, NewTeam } from "@/types/database";
import { useParticipants } from "@/hooks/useParticipants"; // Assuming this is the correct hook path
import { ParticipantsTable } from "./ParticipantsTable";
import { RegisterIndividualDialog } from "./RegisterIndividualDialog";
import { RegisterTeamDialog } from "./RegisterTeamDialog";
import { EditIndividualDialog } from "./EditIndividualDialog";
import { EditTeamDialog } from "./EditTeamDialog";             
import { exportIndividualsToExcel, exportTeamsToExcel } from "@/lib/exportToExcel";
import { Button } from "@/components/ui/button";
import { Download, Trophy, Users, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the shape of the update functions we expect from useParticipants
interface ParticipantUpdatePayload {
  id: number;
  updatedData: any; // Could be IndividualParticipant or Team structure
}

interface GameDashboardProps {
  game: Game | null;
}

export function GameDashboard({ game }: GameDashboardProps) {
  // State for managing the edit modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<IndividualParticipant | Team | null>(null);
  const { 
    individuals, 
    teams, 
    loading, 
    adding, 
    addIndividual, 
    addTeam,
    deleteIndividual,   
    deleteTeam,
    updateIndividual,  
    updateTeam,         
  } = useParticipants(game?.id ?? null, game?.is_group_game ?? false);
  // --------------------------------

  // --- UI RENDER HANDLERS (Same as before) ---
  if (!game) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">Welcome to Sports Week</h2>
          <p className="text-muted-foreground">
            Select a game from the sidebar to view and manage participants, or create a new game to get started.
          </p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    if (game.is_group_game) {
      exportTeamsToExcel(teams, game.name);
    } else {
      exportIndividualsToExcel(individuals, game.name);
    }
  };

  const count = game.is_group_game ? teams.length : individuals.length;
  const label = game.is_group_game ? "Teams" : "Participants";

  // --- CRUD ACTION HANDLERS ---

  const handleEditClick = (record: IndividualParticipant | Team) => {
    setRecordToEdit(record);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm(`Are you sure you want to delete this ${game.is_group_game ? 'team' : 'participant'}?`)) {
      if (game.is_group_game) {
        deleteTeam(id);
      } else {
        deleteIndividual(id);
      }
    }
  };

  const handleUpdateSubmit = (updatedData: any) => {
    if (!recordToEdit) return;

    const payload: ParticipantUpdatePayload = { 
        id: recordToEdit.id, 
        updatedData 
    };

    if (game.is_group_game) {
      updateTeam(payload);
    } else {
      updateIndividual(payload);
    }
    
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <header className="px-8 py-6 border-b bg-card">
        {/* ... (Header content remains the same) ... */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              {game.is_group_game ? (
                <Users className="h-6 w-6 text-primary-foreground" />
              ) : (
                <User className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold">{game.name}</h1>
                <Badge variant={game.is_group_game ? "default" : "secondary"}>
                  {game.is_group_game ? "Team Game" : "Individual Game"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {count} {label.toLowerCase()} registered
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Registration Dialogs */}
            {game.is_group_game ? (
              <RegisterTeamDialog
                gameId={game.id}
                gameName={game.name}
                onRegister={addTeam}
                isLoading={adding}
              />
            ) : (
              <RegisterIndividualDialog
                gameId={game.id}
                gameName={game.name}
                onRegister={addIndividual}
                isLoading={adding}
              />
            )}
            {/* Export Button */}
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExport}
              disabled={count === 0}
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="flex-1 overflow-auto p-8">
        {loading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        ) : (
            <ParticipantsTable
              individuals={individuals}
              teams={teams}
              isGroupGame={game.is_group_game}
              loading={loading}
              
              // --- PASS HANDLERS TO THE TABLE COMPONENT ---
              onEdit={handleEditClick}      // Passes function to open the modal
              onDelete={handleDeleteClick}  // Passes function to handle deletion
            />
        )}
      </main>

      {/* --- CONDITIONAL EDIT MODALS --- */}
      {isEditModalOpen && recordToEdit && (
        game.is_group_game ? (
          <EditTeamDialog
            team={recordToEdit as Team}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleUpdateSubmit}
          />
        ) : (
          <EditIndividualDialog
            participant={recordToEdit as IndividualParticipant}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleUpdateSubmit}
          />
        )
      )}
    </div>
  );
}