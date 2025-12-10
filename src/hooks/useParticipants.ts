import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IndividualParticipant, Team, NewIndividualParticipant, NewTeam, TeamMember } from "@/types/database";
import { toast } from "sonner";

export function useParticipants(gameId: number | null, isGroupGame: boolean) {
  const [individuals, setIndividuals] = useState<IndividualParticipant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchIndividuals = async () => {
    if (!gameId || isGroupGame) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("individual_participants")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setIndividuals(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch participants: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    if (!gameId || !isGroupGame) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      // Parse team_members from JSONB
      const parsedTeams = (data || []).map(team => ({
        ...team,
        team_members: (team.team_members as unknown as TeamMember[]) || []
      }));
      setTeams(parsedTeams);
    } catch (error: any) {
      toast.error("Failed to fetch teams: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addIndividual = async (participant: NewIndividualParticipant) => {
    try {
      setAdding(true);
      const { error } = await supabase
        .from("individual_participants")
        .insert([participant]);

      if (error) throw error;
      toast.success("Participant registered successfully!");
    } catch (error: any) {
      toast.error("Failed to register participant: " + error.message);
    } finally {
      setAdding(false);
    }
  };

  const addTeam = async (team: NewTeam) => {
    try {
      setAdding(true);
      const { error } = await supabase
        .from("teams")
        .insert([{
          ...team,
          team_members: team.team_members as unknown as any
        }]);

      if (error) throw error;
      toast.success("Team registered successfully!");
    } catch (error: any) {
      toast.error("Failed to register team: " + error.message);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    if (!gameId) {
      setIndividuals([]);
      setTeams([]);
      return;
    }

    if (isGroupGame) {
      fetchTeams();
    } else {
      fetchIndividuals();
    }

    const tableName = isGroupGame ? "teams" : "individual_participants";
    const channel = supabase
      .channel(`${tableName}-realtime-${gameId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName, filter: `game_id=eq.${gameId}` },
        () => {
          if (isGroupGame) {
            fetchTeams();
          } else {
            fetchIndividuals();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, isGroupGame]);

  return {
    individuals,
    teams,
    loading,
    adding,
    addIndividual,
    addTeam,
  };
}
