import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Game, NewGame } from "@/types/database";
import { toast } from "sonner";

// Define the structure for updating a game
interface GameUpdate {
  id: number;
  name?: string;
  is_group_game?: boolean; // Make sure your Game type includes this boolean
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // --- READ (R) ---
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

  // --- CREATE (C) ---
  const addGame = async (newGame: NewGame) => {
    try {
      const { data, error } = await supabase
        .from("games")
        .insert([newGame])
        .select()
        .single();

      if (error) throw error;
      toast.success(`Game "${data.name}" added successfully!`);
      // No need to manually call fetchGames, the realtime listener will handle it!
      return data;
    } catch (error: any) {
      toast.error("Failed to add game: " + error.message);
      return null;
    }
  };

  // --- UPDATE (U) ---
  const updateGame = async ({ id, name, is_group_game }: GameUpdate) => {
    try {
      // Create an object with only the fields that are provided (and not undefined)
      const updatePayload: Partial<GameUpdate> = {};
      if (name !== undefined) updatePayload.name = name;
      if (is_group_game !== undefined) updatePayload.is_group_game = is_group_game;

      if (Object.keys(updatePayload).length === 0) {
        toast.info("No changes detected.");
        return true;
      }

      const { error } = await supabase
        .from("games")
        .update(updatePayload)
        .eq("id", id); // Target the specific game row

      if (error) throw error;
      toast.success(`Game updated successfully!`);
      // The realtime listener will trigger fetchGames()
      return true;
    } catch (error: any) {
      toast.error("Failed to update game: " + error.message);
      return false;
    }
  };

  // --- DELETE (D) ---
  const deleteGame = async (id: number, name: string) => {
    if (!window.confirm(`WARNING: Deleting "${name}" will permanently remove all associated participant data due to foreign key constraints. Are you sure?`)) {
        return false;
    }
    
    try {
      const { error } = await supabase
        .from("games")
        .delete()
        .eq("id", id); // Target the specific game row

      if (error) throw error;
      toast.success(`Game "${name}" and all related data deleted successfully.`);
      // The realtime listener will trigger fetchGames()
      return true;
    } catch (error: any) {
      toast.error("Failed to delete game: " + error.message);
      return false;
    }
  };

  // --- REALTIME LISTENER ---
  useEffect(() => {
    fetchGames(); // Initial fetch

    const channel = supabase
      .channel("games-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        () => {
          // Re-fetch data on any change (INSERT, UPDATE, DELETE)
          fetchGames(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { games, loading, addGame, updateGame, deleteGame, refetch: fetchGames };
}