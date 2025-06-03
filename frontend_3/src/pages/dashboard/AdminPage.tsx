import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Lloji i të dhënave që presim nga logs
type Log = {
  username: string;
  action: string;
  date: string;
};

const AdminPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");

  // Ngarko të dhëna demo (ose zëvendëso me fetch nga API)
  useEffect(() => {
    const demoLogs: Log[] = [
      { username: "admin1", action: "Login", date: "2025-06-03" },
      { username: "user1", action: "Created Product", date: "2025-06-02" },
      { username: "admin1", action: "Deleted Order", date: "2025-06-01" },
    ];
    setLogs(demoLogs);
  }, []);

  // Filtrim për kërkim
  const filteredLogs = logs.filter(
    (log) =>
      log.username.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.date.includes(search)
  );

  // Eksporto si PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Logs", 14, 10);
    doc.autoTable({
      head: [["Username", "Action", "Date"]],
      body: filteredLogs.map((log) => [log.username, log.action, log.date]),
    });
    doc.save("admin_logs.pdf");
  };

  // Eksporto si Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "admin_logs.xlsx");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Logjet e Administratorit
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Kërko në logje"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={exportPDF}>
          Eksporto PDF
        </Button>
        <Button variant="contained" color="success" onClick={exportExcel}>
          Eksporto Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Username</b></TableCell>
              <TableCell><b>Action</b></TableCell>
              <TableCell><b>Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.username}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.date}</TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Asnjë rezultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPage;