import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Import Button
import { IndividualParticipant, Team } from "@/types/database";
import { User, Users, Pencil, Trash2 } from "lucide-react"; // Import Icons
import { Badge } from "@/components/ui/badge";

// Update the props interface to accept the handlers
interface ParticipantsTableProps {
  individuals: IndividualParticipant[];
  teams: Team[];
  isGroupGame: boolean;
  loading: boolean;
  // NEW PROPS: Handlers to open modals or trigger delete actions
  onEdit: (record: IndividualParticipant | Team) => void;
  onDelete: (id: number) => void;
}

export function ParticipantsTable({
  individuals,
  teams,
  isGroupGame,
  loading,
  onEdit, // Destructure the new handlers
  onDelete, // Destructure the new handlers
}: ParticipantsTableProps) {
  // ... (Loading state remains the same)
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // --- TEAM GAME TABLE ---
  if (isGroupGame) {
    if (teams.length === 0) {
      // ... (No Teams Registered state remains the same)
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-lg text-muted-foreground">No Teams Registered</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Click "Register Team" to add the first team.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[50px]">#</TableHead>
              <TableHead className="font-semibold">Team Name</TableHead>
              <TableHead className="font-semibold">Members</TableHead>
              <TableHead className="font-semibold">Captain Faculty</TableHead>
              <TableHead className="font-semibold w-[120px]">Captain Semester</TableHead>
              <TableHead className="font-semibold text-center w-[120px]">Actions</TableHead> {/* <-- NEW ACTIONS HEAD */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={team.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-semibold">{team.team_name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {team.team_members.map((member, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {member.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{team.captain_faculty}</TableCell>
                <TableCell>
                  <Badge variant="outline">Sem {team.captain_semester}</Badge>
                </TableCell>
                {/* <-- NEW ACTIONS CELL --> */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(team)} // Pass the whole team object
                      title="Edit Team"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(team.id)} // Pass the ID
                      title="Delete Team"
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // --- INDIVIDUAL PARTICIPANTS TABLE ---
  if (individuals.length === 0) {
    // ... (No Participants Registered state remains the same)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-display text-lg text-muted-foreground">No Participants Registered</h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Click "Register Participant" to add the first participant.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold w-[50px]">#</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Faculty</TableHead>
            <TableHead className="font-semibold w-[120px]">Semester</TableHead>
            <TableHead className="font-semibold text-center w-[120px]">Actions</TableHead> {/* <-- NEW ACTIONS HEAD */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {individuals.map((participant, index) => (
            <TableRow key={participant.id} className="hover:bg-muted/30 transition-colors group">
              <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="font-semibold">{participant.full_name}</TableCell>
              <TableCell>{participant.phone}</TableCell>
              <TableCell>{participant.faculty}</TableCell>
              <TableCell>
                <Badge variant="outline">Sem {participant.semester}</Badge>
              </TableCell>
              {/* <-- NEW ACTIONS CELL --> */}
              <TableCell className="text-center">
                <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(participant)} // Pass the whole participant object
                    title="Edit Participant"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(participant.id)} // Pass the ID
                    title="Delete Participant"
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}