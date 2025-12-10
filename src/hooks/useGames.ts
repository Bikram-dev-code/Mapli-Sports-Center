import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Game, NewGame } from "@/types/database";
import { useEffect } from "react";
import { toast } from "sonner";

export function useGames() {
  const queryClient = useQueryClient();

  const { data: games = [], isLoading, error } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as Game[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("games-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["games"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addGame = useMutation({
    mutationFn: async (newGame: NewGame) => {
      const { data, error } = await supabase
        .from("games")
        .insert([newGame])
        .select()
        .single();
      
      if (error) throw error;
      return data as Game;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add game: " + error.message);
    },
  });

  const deleteGame = useMutation({
    mutationFn: async (gameId: number) => {
      const { error } = await supabase
        .from("games")
        .delete()
        .eq("id", gameId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete game: " + error.message);
    },
  });

  return {
    games,
    isLoading,
    error,
    addGame,
    deleteGame,
  };
}
