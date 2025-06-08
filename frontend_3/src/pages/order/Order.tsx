import React, { useEffect, useState } from "react";
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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

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

interface ShippingAddressDto {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: string;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderListDto[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<
    ShippingAddressDto[]
  >([]);
  const [formData, setFormData] = useState<Partial<OrderDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = "https://localhost:7039/api/Order";
  const shippingApiUrl = "https://localhost:7039/api/ShippingAddress";

  useEffect(() => {
    fetchOrders();
    fetchShippingAddresses();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(apiUrl);
      setOrders(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage("User nuk është autentifikuar. Ju lutem hyni përsëri.");
      } else {
        console.error("Gabim gjatë marrjes së porosive:", error);
      }
    }
  };

  const fetchShippingAddresses = async () => {
    try {
      const response = await axiosInstance.get(shippingApiUrl);
      setShippingAddresses(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së adresave të transportit:", error);
    }
  };

  // Për të marrë rrugën nga ID-ja
  const getStreetById = (id: number): string => {
    const addr = shippingAddresses.find((a) => a.id === id);
    if (!addr) return `ID: ${id}`;
    return `${addr.street}, ${addr.city}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name!]:
        name === "totalPrice" || name === "shippingAddressId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        await axiosInstance.put(
          `${apiUrl}/${editingId}`,
          { id: editingId, ...requestData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Sukses", "Porosia u përditësua me sukses.", "success");
      } else {
        await axiosInstance.post(apiUrl, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Sukses", "Porosia u shtua me sukses.", "success");
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      setErrorMessage(null);
      fetchOrders();
    } catch (error: any) {
      console.error("Gabim gjatë ruajtjes së porosisë:", error);
      Swal.fire(
        "Gabim",
        "Ndodhi një gabim gjatë ruajtjes së porosisë.",
        "error"
      );
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

    const confirm = await Swal.fire({
      title: "A jeni i sigurt?",
      text: "Kjo porosi do të fshihet përgjithmonë!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Po, fshije!",
      cancelButtonText: "Anulo",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`${apiUrl}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Fshirë!", "Porosia u fshi me sukses.", "success");
        fetchOrders();
      } catch (error: any) {
        console.error("Gabim gjatë fshirjes së porosisë:", error);
        Swal.fire(
          "Gabim",
          "Ndodhi një gabim gjatë fshirjes së porosisë.",
          "error"
        );
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
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Username</strong>
              </TableCell>
              <TableCell>
                <strong>Shipping Address</strong>
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
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.username || "Anonim"}</TableCell>
                <TableCell>{getStreetById(order.shippingAddressId)}</TableCell>
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
          {editingId ? "Ndrysho Porosin" : "Shto Porosi"}
        </DialogTitle>
        <DialogContent>
          <form id="order-form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="shipping-label">Adresa e Transportit</InputLabel>
              <Select
                labelId="shipping-label"
                id="shippingAddressId"
                name="shippingAddressId"
                value={formData.shippingAddressId ?? ""}
                label="Adresa e Transportit"
                onChange={handleChange}
                required
              >
                {shippingAddresses.map((addr) => (
                  <MenuItem key={addr.id} value={addr.id}>
                    {addr.street}, {addr.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              label="Statusi"
              name="status"
              value={formData.status ?? ""}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              margin="normal"
              label="Totali"
              name="totalPrice"
              type="number"
              inputProps={{ step: "0.01" }}
              value={formData.totalPrice ?? ""}
              onChange={handleChange}
              fullWidth
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Anulo
          </Button>
          <Button
            type="submit"
            form="order-form"
            variant="contained"
            color="primary"
          >
            {editingId ? "Ruaj Ndryshimet" : "Shto"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Order;
