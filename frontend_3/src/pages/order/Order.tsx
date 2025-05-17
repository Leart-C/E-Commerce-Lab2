import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';
import { UserDto } from '../dashboard/UserPage';

interface OrderDto {
  id: number;
  userId: string;
  shippingAddressId: number;
  status: string;
  totalPrice: number;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [formData, setFormData] = useState<Partial<OrderDto>>({});
  const [users, setUsers] = useState<UserDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = 'https://localhost:7039/api/Order'; // Sigurohu që ky endpoint ekziston në backend

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(apiUrl);
      setOrders(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së porosive:', error);
    }
  };
  const fetchUsers = async () => {
  try {
    const response = await axios.get<UserDto[]>('https://localhost:7039/api/user'); 
    setUsers(response.data);
  } catch (error) {
    console.error('Gabim gjatë marrjes së përdoruesve:', error);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalPrice' || name === 'shippingAddressId' ? Number(value) : value,
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
      fetchOrders();
    } catch (error) {
      console.error('Gabim gjatë ruajtjes së porosisë:', error);
    }
  };

  const handleEdit = (order: OrderDto) => {
    setFormData(order);
    setEditingId(order.id);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('A jeni i sigurt që dëshironi të fshini këtë porosi?')) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchOrders();
      } catch (error) {
        console.error('Gabim gjatë fshirjes së porosisë:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Menaxhimi i Porosive</h2>

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Shto Porosi
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Shipping Address ID</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Totali</strong></TableCell>
              <TableCell><strong>Veprime</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
               <TableCell>
{
    (() => {
        const user = users.find(user => user.id === order.userId);
        if (user) {
            return user.username ?? 'Username Not Found'; // Add a fallback if username is missing
        } else {
            console.log(`Order ID: ${order.id}, User ID not found: ${order.userId}`); // Debug: Log if user ID isn't found
            return 'Anonim';
        }
    })()
}
</TableCell>

                <TableCell>{order.shippingAddressId}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleEdit(order)} variant="outlined" color="primary">Edito</Button>
                    <Button onClick={() => handleDelete(order.id)} variant="outlined" color="error">Fshi</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edito Porosinë' : 'Shto Porosi'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="User ID"
              name="userId"
              value={formData.userId || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Shipping Address ID"
              name="shippingAddressId"
              type="number"
              value={formData.shippingAddressId || ''}
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
            <TextField
              label="Total Price"
              name="totalPrice"
              type="number"
              value={formData.totalPrice || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              inputProps={{ step: '0.01' }}
            />
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} color="secondary">Anulo</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? 'Përditëso' : 'Shto'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Order;