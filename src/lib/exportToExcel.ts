import * as XLSX from "xlsx";
import { Participant } from "@/types/database";

export function exportToExcel(participants: Participant[], gameName: string) {
  // Prepare data for export
  const exportData = participants.map((p, index) => ({
    "#": index + 1,
    "Full Name": p.full_name,
    "Student ID": p.student_id,
    "Phone Number": p.phone,
    "Team Name": p.team_name || "N/A",
    "Registration Date": new Date(p.created_at).toLocaleDateString(),
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 5 },   // #
    { wch: 25 },  // Full Name
    { wch: 15 },  // Student ID
    { wch: 15 },  // Phone Number
    { wch: 20 },  // Team Name
    { wch: 18 },  // Registration Date
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  // Generate filename
  const sanitizedGameName = gameName.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${sanitizedGameName}_Participants.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, filename);
}
