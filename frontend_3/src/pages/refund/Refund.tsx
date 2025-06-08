import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

interface RefundDto {
  id: number;
  paymentId: number;
  amount: number;
  status: string;
}

const Refund: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundDto[]>([]);
  const [formData, setFormData] = useState<Partial<RefundDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = "https://localhost:7039/api/Refund";

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const response = await axiosInstance.get(apiUrl);
      setRefunds(response.data);
    } catch (error) {
      Swal.fire("Gabim!", "Nuk mund të merren të dhënat.", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "paymentId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validimi bazik
    if (!formData.paymentId || !formData.amount || !formData.status) {
      Swal.fire({
        icon: "warning",
        title: "Vlerë mungon",
        text: "Të gjitha fushat janë të detyrueshme.",
      });
      return;
    }

    try {
      if (editingId !== null) {
        // PUT për përditësim
        const payload = {
          id: editingId,
          paymentId: formData.paymentId,
          amount: formData.amount,
          status: formData.status,
        };

        await axiosInstance.put(`${apiUrl}/${editingId}`, payload);
        Swal.fire(
          "U përditësua!",
          "Rimbursimi u ndryshua me sukses.",
          "success"
        );
      } else {
        // POST për shtim të ri (mos dërgo ID!)
        const payload = {
          paymentId: formData.paymentId,
          amount: formData.amount,
          status: formData.status,
        };

        await axiosInstance.post(apiUrl, payload);
        Swal.fire("U shtua!", "Rimbursimi u shtua me sukses.", "success");
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchRefunds();
    } catch (error) {
      console.error("Gabim në ruajtje:", error);
      Swal.fire({
        icon: "error",
        title: "Gabim!",
        text: "Ndodhi një gabim gjatë ruajtjes.",
      });
    }
  };

  const handleEdit = (refund: RefundDto) => {
    setFormData(refund);
    setEditingId(refund.id);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
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
        await axiosInstance.delete(`${apiUrl}/${id}`);
        Swal.fire("Fshirë!", "Rimbursimi u fshi me sukses.", "success");
        fetchRefunds();
      } catch (error) {
        Swal.fire("Gabim!", "Nuk u arrit të fshihet rimbursimi.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxho Rimbursimet
      </h2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Rimbursim
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Payment ID</strong>
              </TableCell>
              <TableCell>
                <strong>Shuma</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Veprime</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map((refund) => (
              <TableRow key={refund.id}>
                <TableCell>{refund.id}</TableCell>
                <TableCell>{refund.paymentId}</TableCell>
                <TableCell>{refund.amount}</TableCell>
                <TableCell>{refund.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(refund)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(refund.id)}
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Përditëso Rimbursim" : "Shto Rimbursim"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Payment ID"
              name="paymentId"
              type="number"
              value={formData.paymentId || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Shuma"
              name="amount"
              type="number"
              value={formData.amount || ""}
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

export default Refund;
