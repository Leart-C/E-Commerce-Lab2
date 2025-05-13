import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';

interface PaymentDto {
  id: number;
  paymentMethodId: number;
  orderId: number;
  amount: number;
}

interface PaymentMethod {
  id: number;
  name: string;
}

const Payment: React.FC = () => {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState<Partial<PaymentDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const paymentApiUrl = 'https://localhost:7039/api/Payment';
  const paymentMethodApiUrl = 'https://localhost:7039/api/PaymentMethod';

  useEffect(() => {
    fetchPayments();
    fetchPaymentMethods();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(paymentApiUrl);
      setPayments(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së pagesave:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(paymentMethodApiUrl);
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së metodave të pagesës:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'paymentMethodId' || name === 'orderId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await axios.put(`${paymentApiUrl}/${editingId}`, formData);
      } else {
        await axios.post(paymentApiUrl, formData);
      }
      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchPayments();
    } catch (error) {
      console.error('Gabim gjatë ruajtjes së pagesës:', error);
    }
  };

  const handleEdit = (payment: PaymentDto) => {
    setFormData(payment);
    setEditingId(payment.id);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('A jeni i sigurt që dëshironi të fshini këtë pagesë?')) {
      try {
        await axios.delete(`${paymentApiUrl}/${id}`);
        fetchPayments();
      } catch (error) {
        console.error('Gabim gjatë fshirjes së pagesës:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Menaxhimi i Pagesave</h2>

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Shto Pagesë
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Shuma</strong></TableCell>
              <TableCell><strong>ID Porosisë</strong></TableCell>
              <TableCell><strong>Metoda Pagesës</strong></TableCell>
              <TableCell><strong>Veprime</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>
                  {paymentMethods.find(pm => pm.id === payment.paymentMethodId)?.name || payment.paymentMethodId}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleEdit(payment)} variant="outlined" color="primary">Edito</Button>
                    <Button onClick={() => handleDelete(payment.id)} variant="outlined" color="error">Fshi</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingId ? 'Edito Pagesën' : 'Shto Pagesë'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Shuma"
              name="amount"
              type="number"
              value={formData.amount || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="ID Porosisë"
              name="orderId"
              type="number"
              value={formData.orderId || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              select
              label="Metoda Pagesës"
              name="paymentMethodId"
              value={formData.paymentMethodId ?? ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="">-- Zgjidh Metodën e Pagesës --</option>
              {paymentMethods.map(pm => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </TextField>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} color="secondary">Anulo</Button>
              <Button type="submit" color="primary" variant="contained">
                {editingId ? 'Përditëso' : 'Shto'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
