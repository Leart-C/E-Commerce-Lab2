import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

interface Product {
  id: string;
  name: string;
}

interface OrderItem {
  id?: string;
  orderId: number;
  productId: string;
  quantity: number;
  price: number;
}

const OrderItem: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState<Partial<OrderItem>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // NEW

  const apiUrl = "https://localhost:7039/api/OrderItem";
  const productsUrl = "https://localhost:7039/api/Product"; // YOUR Product API

  useEffect(() => {
    fetchOrderItems();
    fetchProducts(); // NEW
  }, []);

  const fetchOrderItems = async () => {
    try {
      const response = await axios.get(apiUrl);
      setOrderItems(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së artikujve:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(productsUrl);
      console.log("Produktet:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së produkteve:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]:
        name === "orderId" || name === "quantity" || name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${apiUrl}`, { ...formData, id: editingId });
        Swal.fire("Sukses!", "Artikulli u përditësua me sukses.", "success");
      } else {
        await axios.post(apiUrl, formData);
        Swal.fire("Sukses!", "Artikulli u shtua me sukses.", "success");
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchOrderItems();
    } catch (error: any) {
      Swal.fire("Gabim!", error.response?.data || "Ndodhi një gabim.", "error");
    }
  };

  const handleEdit = (item: OrderItem) => {
    setFormData(item);
    setEditingId(item.id || null);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "A jeni i sigurt?",
      text: "Ky veprim nuk mund të zhbëhet!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Po, fshije!",
      cancelButtonText: "Anulo",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        Swal.fire("Fshirë!", "Artikulli u fshi me sukses.", "success");
        fetchOrderItems();
      } catch (error) {
        Swal.fire("Gabim!", "Nuk u arrit të fshihet artikulli.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Artikujve të Porosisë
      </h2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Artikull
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>
              <TableCell>
                <strong>Product ID</strong>
              </TableCell>
              <TableCell>
                <strong>Sasia</strong>
              </TableCell>
              <TableCell>
                <strong>Çmimi</strong>
              </TableCell>
              <TableCell>
                <strong>Veprime</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.orderId}</TableCell>
                <TableCell>{item.productId}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price.toFixed(2)} €</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id!)}
                      variant="outlined"
                      color="error"
                    >
                      Fshi
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Add/Edit */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Përditëso Artikullin" : "Shto Artikull"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Order ID"
              name="orderId"
              value={formData.orderId || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
            />

            <FormControl fullWidth required margin="normal">
              <InputLabel id="product-select-label">Produkt</InputLabel>
              <Select
                labelId="product-select-label"
                name="productId"
                value={formData.productId || ""}
                onChange={handleChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.productName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Sasia"
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
            />
            <TextField
              label="Çmimi"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
              step="0.01"
            />
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} color="secondary">
                Anulo
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? "Përditëso" : "Shto"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderItem;
