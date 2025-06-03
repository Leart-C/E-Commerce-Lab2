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
  roles?: string;
}

export interface IProduct {
  id: string;
  productName: string;
  price: number;
  categoryId: string;
  categoryName: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<IUserInfoResult[]>([]);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<IProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);


  // Fetch users
  const fetchUsers = async () => {
    try {
      const response =
        await axiosInstance.get<IUserInfoResult[]>("/api/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response =
        await axiosInstance.get<IProduct[]>("/api/Product");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/Category");
    setCategories(response.data);
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};


  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.userName || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    (product.productName || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  // Eksport për përdorues
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista e Përdoruesve", 14, 10);
    autoTable(doc, {
      head: [["Username", "Email", "Roli"]],
      body: filteredUsers.map((u) => [
        u.userName,
        u.email,
        u.roles || "-",
      ]),
    });
    doc.save("users_list.pdf");
  };

  const exportExcel = () => {
    const data = filteredUsers.map((u) => ({
      Username: u.userName,
      Email: u.email,
      Roli: u.roles || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Përdoruesit");
    XLSX.writeFile(workbook, "users_list.xlsx");
  };

  // Eksport për produkte
  const exportProductsPDF = () => {
  const doc = new jsPDF();
  doc.text("Lista e Produkteve", 14, 10);
  autoTable(doc, {
    head: [["Emri", "Çmimi", "Kategoria"]],
    body: filteredProducts.map((p) => [
      p.productName,
      `${p.price}€`,
      categories.find((c) => c.id === p.categoryId)?.categoryName || "Pa kategori",
    ]),
  });
  doc.save("products_list.pdf");
};


  const exportProductsExcel = () => {
  const data = filteredProducts.map((p) => ({
    Emri: p.productName,
    Cmimi: `${p.price}€`,
    Kategoria: categories.find((c) => c.id === p.categoryId)?.categoryName || "Pa kategori",
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produktet");
  XLSX.writeFile(workbook, "products_list.xlsx");
};


  return (
    <Box p={3}>
      {/* ================= Përdoruesit ================= */}
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

      <TableContainer component={Paper} sx={{ mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Username</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Roli</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles || "-"}</TableCell>
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

      {/* ================= Produktet ================= */}
      <Typography variant="h5" mb={2}>
        Lista e Produkteve
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Kërko me emër produkti"
          variant="outlined"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={exportProductsPDF}>
          Eksporto PDF
        </Button>
        <Button variant="outlined" color="success" onClick={exportProductsExcel}>
          Eksporto Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Emri</b></TableCell>
              <TableCell><b>Çmimi</b></TableCell>
              <TableCell><b>Kategoria</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.price}€</TableCell>
                <TableCell>
  {
    categories.find((cat) => cat.id === product.categoryId)?.categoryName ??
    "Pa kategori"
  }
</TableCell>

              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Asnjë produkt i gjetur.
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