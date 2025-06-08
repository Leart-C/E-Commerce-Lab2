/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

interface TransactionDto {
  id: number;
  paymentId: number;
  transactionDate: string;
  status: string;
}

const Transaction: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [formData, setFormData] = useState<Partial<TransactionDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = "https://localhost:7039/api/Transaction";

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get(apiUrl);
      setTransactions(response.data);
    } catch (error) {
      Swal.fire("Gabim!", "Nuk u mundësua marrja e transaksioneve.", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paymentId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !formData.paymentId ||
        !formData.transactionDate ||
        !formData.status
      ) {
        Swal.fire(
          "Kujdes!",
          "Të gjitha fushat janë të detyrueshme.",
          "warning"
        );
        return;
      }

      if (editingId !== null) {
        await axiosInstance.put(`${apiUrl}/${editingId}`, {
          ...formData,
          id: editingId,
        });
        Swal.fire("Sukses!", "Transaksioni u përditësua me sukses.", "success");
      } else {
        await axiosInstance.post(apiUrl, formData);
        Swal.fire("Sukses!", "Transaksioni u shtua me sukses.", "success");
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchTransactions();
    } catch (error) {
      Swal.fire("Gabim!", "Ndodhi një gabim gjatë ruajtjes.", "error");
    }
  };

  const handleEdit = (transaction: TransactionDto) => {
    setFormData(transaction);
    setEditingId(transaction.id);
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
        Swal.fire("Fshirë!", "Transaksioni u fshi me sukses.", "success");
        fetchTransactions();
      } catch (error) {
        Swal.fire("Gabim!", "Nuk u arrit të fshihet transaksioni.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Transaksioneve
      </h2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Shto Transaksion
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>PaymentId</strong>
              </TableCell>
              <TableCell>
                <strong>Data</strong>
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
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.id}</TableCell>
                <TableCell>{tx.paymentId}</TableCell>
                <TableCell>
                  {new Date(tx.transactionDate).toLocaleString()}
                </TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(tx)}
                      variant="outlined"
                      color="primary"
                    >
                      Edito
                    </Button>
                    <Button
                      onClick={() => handleDelete(tx.id)}
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
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edito Transaksionin" : "Shto Transaksion"}
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
              label="Data e Transaksionit"
              name="transactionDate"
              type="datetime-local"
              value={
                formData.transactionDate
                  ? formData.transactionDate.slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
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

export default Transaction;
