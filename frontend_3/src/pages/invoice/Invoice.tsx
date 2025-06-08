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

interface InvoiceDto {
  id: number;
  paymentId: number;
  amount: number;
  issueDate: string;
  status: string;
}

const Invoice: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [formData, setFormData] = useState<Partial<InvoiceDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = "https://localhost:7039/api/Invoice";

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(apiUrl);
      setInvoices(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së faturave:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paymentId" || name === "amount" ? Number(value) : value,
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
      fetchInvoices();
    } catch (error) {
      console.error("Gabim gjatë ruajtjes së faturës:", error);
    }
  };

  const handleEdit = (invoice: InvoiceDto) => {
    setFormData({
      ...invoice,
      issueDate: invoice.issueDate.split("T")[0], // yyyy-MM-dd
    });
    setEditingId(invoice.id);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("A jeni i sigurt që dëshironi ta fshini këtë faturë?")) {
      try {
        await axiosInstance.delete(`${apiUrl}/${id}`);
        fetchInvoices();
      } catch (error) {
        console.error("Gabim gjatë fshirjes së faturës:", error);
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Faturave
      </h2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Faturë
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
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
                <strong>Data e Lëshimit</strong>
              </TableCell>
              <TableCell>
                <strong>Statusi</strong>
              </TableCell>
              <TableCell>
                <strong>Veprime</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.paymentId}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(invoice)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(invoice.id)}
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
        <DialogTitle>
          {editingId ? "Përditëso Faturën" : "Shto Faturë"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Payment ID"
              name="paymentId"
              value={formData.paymentId || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
            />
            <TextField
              label="Shuma"
              name="amount"
              value={formData.amount || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
              step="0.01"
            />
            <TextField
              label="Data e Lëshimit"
              name="issueDate"
              value={formData.issueDate || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Statusi"
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

export default Invoice;
