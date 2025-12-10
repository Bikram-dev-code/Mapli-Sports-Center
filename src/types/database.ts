export interface Game {
  id: number;
  name: string;
  is_group_game: boolean;
  created_at: string;
}

export interface IndividualParticipant {
  id: number;
  game_id: number;
  full_name: string;
  phone: string;
  faculty: string;
  semester: number;
  created_at: string;
}

export interface TeamMember {
  name: string;
  phone: string;
}

export interface Team {
  id: number;
  game_id: number;
  team_name: string;
  team_members: TeamMember[];
  captain_faculty: string;
  captain_semester: number;
  created_at: string;
}

export interface NewGame {
  name: string;
  is_group_game: boolean;
}

export interface NewIndividualParticipant {
  game_id: number;
  full_name: string;
  phone: string;
  faculty: string;
  semester: number;
}

export interface NewTeam {
  game_id: number;
  team_name: string;
  team_members: TeamMember[];
  captain_faculty: string;
  captain_semester: number;
}
