export interface Game {
  id: number;
  name: string;
  created_at: string;
}

export interface Participant {
  id: number;
  game_id: number;
  full_name: string;
  student_id: string;
  phone: string;
  team_name: string | null;
  created_at: string;
}

export interface NewGame {
  name: string;
}

export interface NewParticipant {
  game_id: number;
  full_name: string;
  student_id: string;
  phone: string;
  team_name?: string;
}
