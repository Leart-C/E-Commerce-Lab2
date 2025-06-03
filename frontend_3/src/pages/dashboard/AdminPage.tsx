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
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import axiosInstance from "../../utils/axiosInstance";

export interface IUserInfoResult {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role?: string; // nëse ekziston
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<IUserInfoResult[]>([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response =
        await axiosInstance.get<IUserInfoResult[]>("/api/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.userName || "").toLowerCase().includes(search.toLowerCase())
  );

  // Eksport në PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista e Përdoruesve", 14, 10);
    autoTable(doc, {
      head: [["Username", "Email", "Roli"]],
      body: filteredUsers.map((u) => [
        u.userName,
        u.email,
        u.role || "-", // nëse nuk ka role
      ]),
    });
    doc.save("users_list.pdf");
  };

  // Eksport në Excel
  const exportExcel = () => {
    const data = filteredUsers.map((u) => ({
      Username: u.userName,
      Email: u.email,
      Roli: u.role || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Përdoruesit");
    XLSX.writeFile(workbook, "users_list.xlsx");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Lista e Përdoruesve
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Kërko me username"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={exportPDF}>
          Eksporto PDF
        </Button>
        <Button variant="outlined" color="success" onClick={exportExcel}>
          Eksporto Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Username</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Roli</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || "-"}</TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Asnjë përdorues i gjetur.
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
