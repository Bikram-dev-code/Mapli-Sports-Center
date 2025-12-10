import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Participant, NewParticipant } from "@/types/database";
import { useEffect } from "react";
import { toast } from "sonner";

export function useParticipants(gameId: number | null) {
  const queryClient = useQueryClient();

  const { data: participants = [], isLoading, error } = useQuery({
    queryKey: ["participants", gameId],
    queryFn: async () => {
      if (!gameId) return [];
      
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as Participant[];
    },
    enabled: !!gameId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`participants-${gameId}`)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "participants",
          filter: `game_id=eq.${gameId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["participants", gameId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, queryClient]);

  const addParticipant = useMutation({
    mutationFn: async (newParticipant: NewParticipant) => {
      const { data, error } = await supabase
        .from("participants")
        .insert([newParticipant])
        .select()
        .single();
      
      if (error) throw error;
      return data as Participant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants", gameId] });
      toast.success("Participant registered successfully!");
    },
    onError: (error) => {
      toast.error("Failed to register participant: " + error.message);
    },
  });

  const deleteParticipant = useMutation({
    mutationFn: async (participantId: number) => {
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", participantId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants", gameId] });
      toast.success("Participant removed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to remove participant: " + error.message);
    },
  });

  return {
    participants,
    isLoading,
    error,
    addParticipant,
    deleteParticipant,
  };
}
