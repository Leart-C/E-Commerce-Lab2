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
  userName?: string;
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

interface UserDto {
  id: string;
  userName: string;
}

enum OrderStatus {
  Active = "active",
  Declined = "declined",
  Pending = "pending",
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderListDto[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddressDto[]>([]);
  const [formData, setFormData] = useState<Partial<OrderDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [users, setUsers] = useState<UserDto[]>([]);

  const apiUrl = "/api/Order";
  const shippingApiUrl = "/api/ShippingAddress";
  const usersApiUrl = "/api/Auth/users";

  useEffect(() => {
    fetchOrders();
    fetchShippingAddresses();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(usersApiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së përdoruesve:", error);
    }
  };

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

  const getStreetById = (id: number): string => {
    const addr = shippingAddresses.find((a) => a.id === id);
    if (!addr) return `${id}`;
    return `${addr.street}, ${addr.city}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name!]: name === "totalPrice" || name === "shippingAddressId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingAddressId || !formData.status || !formData.totalPrice) {
      setErrorMessage("Ju lutem plotësoni të gjitha fushat e kërkuara.");
      return;
    }

    try {
      const requestData = {
        shippingAddressId: formData.shippingAddressId,
        status: formData.status,
        totalPrice: formData.totalPrice,
      };

      if (editingId !== null) {
        // EDITIM
        await axiosInstance.put(
          `${apiUrl}/${editingId}`,
          { id: editingId, ...requestData }
        );
      } else {
        // SHTIM
        if (!formData.userName) {
          setErrorMessage("Ju lutem zgjidhni një përdorues për porosinë.");
          return;
        }
        await axiosInstance.post(apiUrl,
          {
            ...requestData,
            userName: formData.userName, // me N të madhe, siç e kërkon backend-i
          }
        );
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      setErrorMessage(null);
      fetchOrders();
    } catch (error: any) {
      console.error("Gabim gjatë ruajtjes së porosisë:", error);
      Swal.fire("Gabim", "Ndodhi një gabim gjatë ruajtjes së porosisë.", "error");
    }
  };

  const handleEdit = (order: OrderListDto) => {
    setFormData({
      id: order.id,
      shippingAddressId: order.shippingAddressId,
      status: order.status,
      totalPrice: order.totalPrice,
      userName: order.username, // për editim mos e ndryshoj username
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
        await axiosInstance.delete(`${apiUrl}/${id}`);
        Swal.fire("Fshirë!", "Porosia u fshi me sukses.", "success");
        fetchOrders();
      } catch (error: any) {
        console.error("Gabim gjatë fshirjes së porosisë:", error);
        Swal.fire("Gabim", "Ndodhi një gabim gjatë fshirjes së porosisë.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Porosive
      </h2>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: "20px" }}>
        Shto Porosi
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Adresa e Transportit</TableCell>
              <TableCell>Statusi</TableCell>
              <TableCell>Totali</TableCell>
              <TableCell>Veprime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.username}</TableCell>
                <TableCell>{getStreetById(order.shippingAddressId)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => handleEdit(order)}>Edito</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(order.id)}>Fshij</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{editingId !== null ? "Edito Porosinë" : "Shto Porosi"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {editingId === null && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="username-label">Përdoruesi</InputLabel>
                <Select
                  labelId="username-label"
                  name="userName"
                  value={formData.userName || ""}
                  onChange={handleChange}
                  required
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.userName}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel id="address-label">Adresa e Transportit</InputLabel>
              <Select
                labelId="address-label"
                name="shippingAddressId"
                value={formData.shippingAddressId || ""}
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

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Statusi</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                required
              >
                {Object.values(OrderStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="totalPrice"
              label="Totali"
              type="number"
              fullWidth
              margin="normal"
              value={formData.totalPrice || ""}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Anulo</Button>
            <Button type="submit" variant="contained" color="primary">
              Ruaj
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Order;
