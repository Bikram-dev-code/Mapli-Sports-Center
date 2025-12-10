-- Create games table
CREATE TABLE public.games (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create participants table
CREATE TABLE public.participants (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  team_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games (public read/write for all users - admin dashboard)
CREATE POLICY "Anyone can view games"
ON public.games
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert games"
ON public.games
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update games"
ON public.games
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete games"
ON public.games
FOR DELETE
USING (true);

-- RLS Policies for participants (public read/write for all users - admin dashboard)
CREATE POLICY "Anyone can view participants"
ON public.participants
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert participants"
ON public.participants
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update participants"
ON public.participants
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete participants"
ON public.participants
FOR DELETE
USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;

-- Create indexes for better performance
CREATE INDEX idx_participants_game_id ON public.participants(game_id);
CREATE INDEX idx_games_name ON public.games(name);