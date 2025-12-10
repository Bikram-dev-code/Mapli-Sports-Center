// src/hooks/useParticipants.ts

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IndividualParticipant, Team, NewIndividualParticipant, NewTeam, TeamMember } from "@/types/database";
import { toast } from "sonner";

interface UpdatePayload {
  id: number;
  updatedData: Partial<IndividualParticipant> | Partial<Omit<Team, 'team_members'>> & { team_members?: any }; 
}

export function useParticipants(gameId: number | null, isGroupGame: boolean) {
  const [individuals, setIndividuals] = useState<IndividualParticipant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // --- Utility Fetch Functions (No changes needed, they handle parsing and state) ---

  const fetchIndividuals = async () => {
    if (!gameId || isGroupGame) return;
    // ... (rest of fetchIndividuals logic)
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
    // ... (rest of fetchTeams logic)
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

  // --- CREATE (C) Functions (No changes needed) ---

  const addIndividual = async (participant: NewIndividualParticipant) => {
    // ... (logic remains the same)
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
    // ... (logic remains the same)
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

  // ------------------------------------------------------------------
  // --- UPDATE (U) Functions ---
  // ------------------------------------------------------------------

  const updateIndividual = async ({ id, updatedData }: UpdatePayload) => {
    if (isGroupGame) return false;
    try {
      // NOTE: We don't set loading here to avoid blocking the whole UI
      const { error } = await supabase
        .from("individual_participants")
        .update(updatedData as Partial<IndividualParticipant>)
        .eq("id", id);

      if (error) throw error;
      toast.success("Participant updated successfully!");
      return true;
    } catch (error: any) {
      toast.error("Failed to update participant: " + error.message);
      return false;
    }
    // Realtime listener handles fetching the updated data
  };

  const updateTeam = async ({ id, updatedData }: UpdatePayload) => {
    if (!isGroupGame) return false;
    try {
      const { error } = await supabase
        .from("teams")
        .update(updatedData as { [key: string]: any })
        .eq("id", id);

      if (error) throw error;
      toast.success("Team updated successfully!");
      return true;
    } catch (error: any) {
      toast.error("Failed to update team: " + error.message);
      return false;
    }
    // Realtime listener handles fetching the updated data
  };

  // ------------------------------------------------------------------
  // --- DELETE (D) Functions ---
  // ------------------------------------------------------------------

  const deleteIndividual = async (id: number) => {
    if (isGroupGame) return false;
    try {
      const { error } = await supabase
        .from("individual_participants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Participant deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error("Failed to delete participant: " + error.message);
      return false;
    }
    // Realtime listener handles fetching the updated data
  };

  const deleteTeam = async (id: number) => {
    if (!isGroupGame) return false;
    try {
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Team deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error("Failed to delete team: " + error.message);
      return false;
    }
    // Realtime listener handles fetching the updated data
  };

  // --- EFFECT (No changes needed, the realtime listener covers CRUD) ---
  
  useEffect(() => {
    // ... (Effect logic remains the same)
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


  // --- FINAL RETURN ---
  return {
    individuals,
    teams,
    loading,
    adding,
    addIndividual,
    addTeam,
    // EXPOSE NEW CRUD FUNCTIONS
    deleteIndividual,
    deleteTeam,
    updateIndividual,
    updateTeam,
  };
}