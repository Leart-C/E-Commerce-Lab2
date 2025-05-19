// Order.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Alert,
} from "@mui/material";

interface OrderListDto {
  id: number;
  username: string;
  shippingAddressId: number;
  status: string;
  totalPrice: number;
}

interface OrderDto {
  id?: number;
  shippingAddressId: number;
  status: string;
  totalPrice: number;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderListDto[]>([]);
  const [formData, setFormData] = useState<Partial<OrderDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = "https://localhost:7039/api/Order";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(apiUrl);
      setOrders(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage("User nuk është autentifikuar. Ju lutem hyni përsëri.");
      } else {
        console.error("Gabim gjatë marrjes së porosive:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalPrice" || name === "shippingAddressId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form u dërgua"); // Test
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setErrorMessage(
        "Ju duhet të jeni i loguar për të krijuar/ndryshuar porosi."
      );
      return;
    }

    try {
      const requestData = {
        shippingAddressId: formData.shippingAddressId!,
        status: formData.status!,
        totalPrice: formData.totalPrice!,
      };

      if (editingId !== null) {
        await axios.put(
          `${apiUrl}/${editingId}`,
          { id: editingId, ...requestData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(apiUrl, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      setErrorMessage(null);
      fetchOrders();
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage("User nuk është autentifikuar. Ju lutem hyni përsëri.");
      } else {
        console.error("Gabim gjatë ruajtjes së porosisë:", error);
      }
    }
  };

  const handleEdit = (order: OrderListDto) => {
    setFormData({
      id: order.id,
      shippingAddressId: order.shippingAddressId,
      status: order.status,
      totalPrice: order.totalPrice,
    });
    setEditingId(order.id);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setErrorMessage("Ju duhet të jeni i loguar për të fshirë porosi.");
      return;
    }

    if (window.confirm("A jeni i sigurt që dëshironi të fshini këtë porosi?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchOrders();
      } catch (error: any) {
        if (error.response?.status === 401) {
          setErrorMessage(
            "User nuk është autentifikuar. Ju lutem hyni përsëri."
          );
        } else {
          console.error("Gabim gjatë fshirjes së porosisë:", error);
        }
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Porosive
      </h2>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Porosi
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Username</strong>
              </TableCell>
              <TableCell>
                <strong>Shipping Address ID</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Totali</strong>
              </TableCell>
              <TableCell>
                <strong>Veprime</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.username || "Anonim"}</TableCell>
                <TableCell>{order.shippingAddressId}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(order)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(order.id)}
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

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edito Porosinë" : "Shto Porosi"}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <TextField
              label="Shipping Address ID"
              name="shippingAddressId"
              type="number"
              value={formData.shippingAddressId || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Status"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Total Price"
              name="totalPrice"
              type="number"
              value={formData.totalPrice || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              inputProps={{ step: "0.01" }}
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

export default Order;
