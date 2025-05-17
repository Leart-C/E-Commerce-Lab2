import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';

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

  const apiUrl = 'https://localhost:7039/api/Refund';

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const response = await axios.get(apiUrl);
      setRefunds(response.data);
    } catch (error) {
      console.error('Error fetching refunds:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'paymentId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await axios.put(`${apiUrl}/${editingId}`, formData);
      } else {
        await axios.post(apiUrl, formData);
      }
      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchRefunds();
    } catch (error) {
      console.error('Error saving refund:', error);
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
    if (window.confirm('Are you sure you want to delete this refund?')) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchRefunds();
      } catch (error) {
        console.error('Error deleting refund:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Manage Refunds</h2>

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Add Refund
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Payment ID</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map(refund => (
              <TableRow key={refund.id}>
                <TableCell>{refund.id}</TableCell>
                <TableCell>{refund.paymentId}</TableCell>
                <TableCell>{refund.amount}</TableCell>
                <TableCell>{refund.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleEdit(refund)} variant="outlined" color="primary">Edit</Button>
                    <Button onClick={() => handleDelete(refund.id)} variant="outlined" color="error">Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingId ? 'Edit Refund' : 'Add Refund'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Payment ID"
              name="paymentId"
              type="number"
              value={formData.paymentId || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Status"
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Refund;