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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

interface ShippingAddressDto {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: string;
  username?: string; // Shtojmë username si optional field
}

interface UserDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
}

const ShippingAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<ShippingAddressDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [formData, setFormData] = useState<Partial<ShippingAddressDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = "https://localhost:7039/api/ShippingAddress";
  const usersApiUrl = "https://localhost:7039/api/Auth/users";

  useEffect(() => {
    fetchAddresses();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(usersApiUrl);
      console.log("Users response:", response.data); // Debug log
      setUsers(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së përdoruesve:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(apiUrl);
      console.log("Addresses response:", response.data); // Debug log
      setAddresses(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së adresave të transportit:", error);
    }
  };

  const getUsernameById = (userId: string): string => {
    console.log("Looking for userId:", userId, "in users:", users); // Debug log
    const user = users.find((u) => u.id === userId);
    return user ? user.userName : `User ID: ${userId}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await axiosInstance.put(`${apiUrl}/${editingId}`, formData);
        Swal.fire("Sukses", "Adresa u përditësua me sukses!", "success");
      } else {
        await axiosInstance.post(apiUrl, formData);
        Swal.fire("Sukses", "Adresa u shtua me sukses!", "success");
      }
      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchAddresses();
    } catch (error) {
      console.error("Gabim gjatë ruajtjes së adresës:", error);
      Swal.fire(
        "Gabim",
        "Ndodhi një gabim gjatë ruajtjes së adresës.",
        "error"
      );
    }
  };

  const handleEdit = (address: ShippingAddressDto) => {
    setFormData(address);
    setEditingId(address.id);
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
      text: "Kjo adresë do të fshihet përfundimisht!",
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
        Swal.fire("Fshirë!", "Adresa u fshi me sukses.", "success");
        fetchAddresses();
      } catch (error) {
        console.error("Gabim gjatë fshirjes së adresës:", error);
        Swal.fire("Gabim", "Nuk u arrit të fshihet adresa.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Adresave të Transportit
      </h2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Adresë
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Rruga</strong>
              </TableCell>
              <TableCell>
                <strong>Qyteti</strong>
              </TableCell>
              <TableCell>
                <strong>Shteti</strong>
              </TableCell>
              <TableCell>
                <strong>Kodi Postar</strong>
              </TableCell>
              <TableCell>
                <strong>Shteti</strong>
              </TableCell>
              <TableCell>
                <strong>Username</strong>
              </TableCell>
              <TableCell>
                <strong>Veprime</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((addr) => (
              <TableRow key={addr.id}>
                <TableCell>{addr.id}</TableCell>
                <TableCell>{addr.street}</TableCell>
                <TableCell>{addr.city}</TableCell>
                <TableCell>{addr.state}</TableCell>
                <TableCell>{addr.postalCode}</TableCell>
                <TableCell>{addr.country}</TableCell>
                <TableCell>{getUsernameById(addr.userId)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(addr)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(addr.id)}
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

      {/* Modal për Add/Edit */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingId ? "Edito Adresën" : "Shto Adresë"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Street"
              name="street"
              value={formData.street || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="State"
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>User</InputLabel>
              <Select
                name="userId"
                value={formData.userId || ""}
                onChange={handleSelectChange}
                label="User"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.userName} ({user.firstName} {user.lastName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

export default ShippingAddress;
