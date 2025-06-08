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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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

export interface IOrderDto {
  id: number;
  shippingAddressId: number;
  status: string;
  totalPrice: number;
}

export interface ICategoryDto {
  id?: string;
  categoryName?: string;
  description?: string;
}

const AdminPage: React.FC = () => {
  // Users
  const [users, setUsers] = useState<IUserInfoResult[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [filterUserRole, setFilterUserRole] = useState<string>("all");
  const [userSortField, setUserSortField] = useState<keyof IUserInfoResult | null>(
    null
  );
  const [userSortDirection, setUserSortDirection] = useState<"asc" | "desc">(
    "asc"
  );

  // Products
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [productSortField, setProductSortField] = useState<keyof IProduct | null>(
    null
  );
  const [productSortDirection, setProductSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  // Orders
  const [orders, setOrders] = useState<IOrderDto[]>([]);
  // Filtrat për porositë
const [filterOrderStatus, setFilterOrderStatus] = useState<string>("all");
const [orderPriceRange, setOrderPriceRange] = useState<{ min: number; max: number }>({
  min: 0,
  max: 100000,
});

  // Categories
  const [categories, setCategories] = useState<ICategoryDto[]>([]);
  const [searchCategory, setSearchCategory] = useState("");

  // Fetch data
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<IUserInfoResult[]>("/api/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get<IProduct[]>("/api/Product");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get<IOrderDto[]>("/api/Order");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get<ICategoryDto[]>("/api/Category");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  // Filtrimi dhe renditja për përdorues
const filteredUsers = users
  .filter((user) =>
    user.userName.toLowerCase().includes(searchUser.toLowerCase())
  )
  .filter((user) => {
    if (filterUserRole === "all") return true;
    const rolesArray = user.roles || [];
    return rolesArray.some(
      (role) => role.toLowerCase() === filterUserRole.toLowerCase()
    );
  })

    



  // Filtrimi dhe renditja për produktet
  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchProduct.toLowerCase())
    )
    .filter((product) => filterCategory === "all" || product.categoryId === filterCategory)
    .filter((product) => product.price >= priceRange.min && product.price <= priceRange.max)
    .sort((a, b) => {
      if (!productSortField) return 0;
      const fieldA = a[productSortField];
      const fieldB = b[productSortField];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return productSortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return productSortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });

  // Funksione eksportimi për përdoruesit
  const exportUsersToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista e Përdoruesve", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Username", "Email", "Role"]],
      body: filteredUsers.map((u) => [u.userName, u.email, u.roles || "-"]),
    });
    doc.save("users.pdf");
  };

  const exportUsersToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map((u) => ({
        Username: u.userName,
        Email: u.email,
        Role: u.roles || "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };

  // Funksione eksportimi për produktet
  const exportProductsToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista e Produkteve", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Emri", "Çmimi", "Kategoria"]],
      body: filteredProducts.map((p) => [
        p.productName,
        p.price + "€",
        categories.find((c) => c.id === p.categoryId)?.categoryName || "Pa kategori",
      ]),
    });
    doc.save("products.pdf");
  };

  const exportProductsToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredProducts.map((p) => ({
        Emri: p.productName,
        Çmimi: p.price,
        Kategoria: categories.find((c) => c.id === p.categoryId)?.categoryName || "Pa kategori",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  // Funksione eksportimi për porositë
  const filteredOrders = orders
  .filter(
    (order) =>
      filterOrderStatus === "all" || order.status.toLowerCase() === filterOrderStatus.toLowerCase()
  )
  .filter(
    (order) => order.totalPrice >= orderPriceRange.min && order.totalPrice <= orderPriceRange.max
  );
  const exportOrdersToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista e Porosive", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Order ID", "Shipping Address ID", "Statusi", "Çmimi Total"]],
      body: orders.map((o) => [o.id, o.shippingAddressId, o.status, o.totalPrice + "€"]),
    });
    doc.save("orders.pdf");
  };

  const exportOrdersToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      orders.map((o) => ({
        "Order ID": o.id,
        "Shipping Address ID": o.shippingAddressId,
        Statusi: o.status,
        "Çmimi Total": o.totalPrice,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  // Funksione eksportimi për kategoritë
   const filteredCategories = categories
    .filter((category) =>
    category.categoryName?.toLowerCase().includes(searchCategory.toLowerCase())
    )
  const exportCategoriesToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista e Kategorive", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Emri i kategorisë", "Përshkrimi"]],
      body: categories.map((c) => [c.categoryName || "-", c.description || "-"]),
    });
    doc.save("categories.pdf");
  };

  const exportCategoriesToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      categories.map((c) => ({
        "Emri i kategorisë": c.categoryName || "-",
        Përshkrimi: c.description || "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, "categories.xlsx");
  };

  // Toggle funksionet e renditjes për përdorues dhe produkte
  const toggleUserSort = (field: keyof IUserInfoResult) => {
    if (userSortField === field) {
      setUserSortDirection(userSortDirection === "asc" ? "desc" : "asc");
    } else {
      setUserSortField(field);
      setUserSortDirection("asc");
    }
  };

  const toggleProductSort = (field: keyof IProduct) => {
    if (productSortField === field) {
      setProductSortDirection(productSortDirection === "asc" ? "desc" : "asc");
    } else {
      setProductSortField(field);
      setProductSortDirection("asc");
    }
  };

  return (
  <Box p={2}>
    {/* USERS */}
    <Typography variant="h5" mb={1}>
      Lista e Përdoruesve
    </Typography>
    <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
      <Button variant="outlined" onClick={exportUsersToPDF}>
        Eksporto PDF
      </Button>
      <Button variant="outlined" onClick={exportUsersToExcel}>
        Eksporto Excel
      </Button>
    </Box>
    <Box display="flex" gap={2} mb={3} flexWrap="wrap">
      <TextField
        label="Kërko përdorues"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />
      <FormControl>
        <InputLabel>Roli</InputLabel>
        <Select
          value={filterUserRole}
          label="Roli"
          onChange={(e) => setFilterUserRole(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">Të gjithë</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 5 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              onClick={() => toggleUserSort("userName")}
              sx={{ cursor: "pointer" }}
            >
              Username {userSortField === "userName" ? (userSortDirection === "asc" ? "▲" : "▼") : ""}
            </TableCell>
            <TableCell
              onClick={() => toggleUserSort("email")}
              sx={{ cursor: "pointer" }}
            >
              Email {userSortField === "email" ? (userSortDirection === "asc" ? "▲" : "▼") : ""}
            </TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* PRODUCTS */}
    <Typography variant="h5" my={2}>
      Lista e Produkteve
    </Typography>
    <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
      <Button variant="outlined" onClick={exportProductsToPDF}>
        Eksporto PDF
      </Button>
      <Button variant="outlined" onClick={exportProductsToExcel}>
        Eksporto Excel
      </Button>
    </Box>
    <Box display="flex" gap={2} mb={3} flexWrap="wrap">
      <TextField
        label="Kërko produkt"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />
      <FormControl>
        <InputLabel>Kategoria</InputLabel>
        <Select
          value={filterCategory}
          label="Kategoria"
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">Të gjitha</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Min Çmimi"
        type="number"
        value={priceRange.min}
        onChange={(e) =>
          setPriceRange({ ...priceRange, min: Number(e.target.value) })
        }
        sx={{ width: 120 }}
      />
      <TextField
        label="Max Çmimi"
        type="number"
        value={priceRange.max}
        onChange={(e) =>
          setPriceRange({ ...priceRange, max: Number(e.target.value) })
        }
        sx={{ width: 120 }}
      />
    </Box>
    <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 5 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              onClick={() => toggleProductSort("productName")}
              sx={{ cursor: "pointer" }}
            >
              Emri {productSortField === "productName" ? (productSortDirection === "asc" ? "▲" : "▼") : ""}
            </TableCell>
            <TableCell
              onClick={() => toggleProductSort("price")}
              sx={{ cursor: "pointer" }}
            >
              Çmimi {productSortField === "price" ? (productSortDirection === "asc" ? "▲" : "▼") : ""}
            </TableCell>
            <TableCell>Kategoria</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.price} €</TableCell>
              <TableCell>
                {categories.find((c) => c.id === product.categoryId)?.categoryName || "Pa kategori"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* ORDERS */}
    <Typography variant="h5" my={2}>
      Lista e Porosive
    </Typography>
    <Box display="flex" gap={2} mb={3} flexWrap="wrap">
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Statusi</InputLabel>
        <Select
          value={filterOrderStatus}
          label="Statusi"
          onChange={(e) => setFilterOrderStatus(e.target.value)}
        >
          <MenuItem value="all">Të gjithë</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Min Çmimi Total"
        type="number"
        value={orderPriceRange.min}
        onChange={(e) =>
          setOrderPriceRange({ ...orderPriceRange, min: Number(e.target.value) })
        }
        sx={{ width: 140 }}
      />
      <TextField
        label="Max Çmimi Total"
        type="number"
        value={orderPriceRange.max}
        onChange={(e) =>
          setOrderPriceRange({ ...orderPriceRange, max: Number(e.target.value) })
        }
        sx={{ width: 140 }}
      />
    </Box>
    <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 5 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Shipping Address ID</TableCell>
            <TableCell>Statusi</TableCell>
            <TableCell>Çmimi Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.shippingAddressId}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.totalPrice} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


    {/* CATEGORIES */}
    {/* CATEGORIES */}
<Typography variant="h5" my={2}>
  Lista e Kategorive
</Typography>
<Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
  <Button variant="outlined" onClick={exportCategoriesToPDF}>
    Eksporto PDF
  </Button>
  <Button variant="outlined" onClick={exportCategoriesToExcel}>
    Eksporto Excel
  </Button>
</Box>
<TextField
  label="Kërko kategori"
  value={searchCategory}
  onChange={(e) => setSearchCategory(e.target.value)}
  sx={{ mb: 2, width: 300 }}
/>
<TableContainer component={Paper} sx={{ maxHeight: 300, mb: 5 }}>
  <Table stickyHeader size="small">
    <TableHead>
      <TableRow>
        <TableCell>Emri i kategorisë</TableCell>
        <TableCell>Përshkrimi</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredCategories.map((category) => (
        <TableRow key={category.id}>
          <TableCell>{category.categoryName || "-"}</TableCell>
          <TableCell>{category.description || "-"}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


  </Box>
);

};

export default AdminPage;
