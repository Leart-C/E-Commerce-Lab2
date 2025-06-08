import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import { refreshToken } from "../../auth/auth.utils";

interface PaymentMethodDto {
  id: number;
  name: string;
}

const PaymentMethod: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
  const [formData, setFormData] = useState<Partial<PaymentMethodDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = "https://localhost:7039/api/PaymentMethod";

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      console.log("axiosInstance", axiosInstance);
      const response = await axiosInstance.get(apiUrl);
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së metodave të pagesës:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } else {
        await axiosInstance.post(apiUrl, formData);
      }
      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchPaymentMethods();
    } catch (error) {
      console.error("Gabim gjatë ruajtjes së metodës së pagesës:", error);
    }
  };

  const handleEdit = (paymentMethod: PaymentMethodDto) => {
    setFormData(paymentMethod);
    setEditingId(paymentMethod.id);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "A jeni i sigurt që dëshironi të fshini këtë metodë pagese?"
      )
    ) {
      try {
        await axiosInstance.delete(`${apiUrl}/${id}`);
        fetchPaymentMethods();
      } catch (error) {
        console.error("Gabim gjatë fshirjes së metodës së pagesës:", error);
      }
    }
  };

  const refreshTokenTest = async () => {
    try {
      await refreshToken();
      console.log("token refresh");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Metodave të Pagesës
      </h2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Metodë Pagesë
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Emri</strong>
              </TableCell>
              <TableCell>
                <strong>Veprime</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentMethods.map((pm) => (
              <TableRow key={pm.id}>
                <TableCell>{pm.id}</TableCell>
                <TableCell>{pm.name}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(pm)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(pm.id)}
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

      {/* Modal for Add/Edit */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edito Metodën e Pagesës" : "Shto Metodë Pagesë"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Emri"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
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

export default PaymentMethod;
