import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Game, NewGame } from "@/types/database";
import { toast } from "sonner";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch games: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addGame = async (newGame: NewGame) => {
    try {
      const { data, error } = await supabase
        .from("games")
        .insert([newGame])
        .select()
        .single();

      if (error) throw error;
      toast.success(`Game "${data.name}" added successfully!`);
      return data;
    } catch (error: any) {
      toast.error("Failed to add game: " + error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchGames();

    const channel = supabase
      .channel("games-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        () => {
          fetchGames();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { games, loading, addGame, refetch: fetchGames };
}
