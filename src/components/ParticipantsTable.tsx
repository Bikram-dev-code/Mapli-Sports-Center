import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndividualParticipant, Team } from "@/types/database";
import { User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ParticipantsTableProps {
  individuals: IndividualParticipant[];
  teams: Team[];
  isGroupGame: boolean;
  loading: boolean;
}

export function ParticipantsTable({ individuals, teams, isGroupGame, loading }: ParticipantsTableProps) {
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

  if (isGroupGame) {
    if (teams.length === 0) {
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
              <TableHead className="font-semibold">#</TableHead>
              <TableHead className="font-semibold">Team Name</TableHead>
              <TableHead className="font-semibold">Members</TableHead>
              <TableHead className="font-semibold">Captain Faculty</TableHead>
              <TableHead className="font-semibold">Captain Semester</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Individual participants table
  if (individuals.length === 0) {
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
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Faculty</TableHead>
            <TableHead className="font-semibold">Semester</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {individuals.map((participant, index) => (
            <TableRow key={participant.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="font-semibold">{participant.full_name}</TableCell>
              <TableCell>{participant.phone}</TableCell>
              <TableCell>{participant.faculty}</TableCell>
              <TableCell>
                <Badge variant="outline">Sem {participant.semester}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
