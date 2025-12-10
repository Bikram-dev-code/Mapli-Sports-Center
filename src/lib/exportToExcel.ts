import * as XLSX from "xlsx";
import { IndividualParticipant, Team } from "@/types/database";

export function exportIndividualsToExcel(participants: IndividualParticipant[], gameName: string) {
  const data = participants.map((p, index) => ({
    "#": index + 1,
    "Name": p.full_name,
    "Phone": p.phone,
    "Faculty": p.faculty,
    "Semester": p.semester,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  // Auto-size columns
  const colWidths = [
    { wch: 5 },   // #
    { wch: 25 },  // Name
    { wch: 15 },  // Phone
    { wch: 20 },  // Faculty
    { wch: 10 },  // Semester
  ];
  worksheet["!cols"] = colWidths;

  const fileName = `${gameName.replace(/\s+/g, "_")}_Participants.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportTeamsToExcel(teams: Team[], gameName: string) {
  const data = teams.map((team, index) => ({
    "#": index + 1,
    "Team Name": team.team_name,
    "Members": team.team_members.map(m => `${m.name} (${m.phone})`).join("; "),
    "Member Count": team.team_members.length,
    "Captain Faculty": team.captain_faculty,
    "Captain Semester": team.captain_semester,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

  // Auto-size columns
  const colWidths = [
    { wch: 5 },   // #
    { wch: 20 },  // Team Name
    { wch: 50 },  // Members
    { wch: 12 },  // Member Count
    { wch: 20 },  // Captain Faculty
    { wch: 15 },  // Captain Semester
  ];
  worksheet["!cols"] = colWidths;

  const fileName = `${gameName.replace(/\s+/g, "_")}_Teams.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
