import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';

interface ShippingAddressDto {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: string;
}

const ShippingAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<ShippingAddressDto[]>([]);
  const [formData, setFormData] = useState<Partial<ShippingAddressDto>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = 'https://localhost:7039/api/ShippingAddress';

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAddresses(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së adresave të transportit:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      fetchAddresses();
    } catch (error) {
      console.error('Gabim gjatë ruajtjes së adresës:', error);
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
    if (window.confirm('A jeni i sigurt që dëshironi të fshini këtë adresë?')) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchAddresses();
      } catch (error) {
        console.error('Gabim gjatë fshirjes së adresës:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Menaxhimi i Adresave të Transportit</h2>

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Shto Adresë
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Rruga</strong></TableCell>
              <TableCell><strong>Qyteti</strong></TableCell>
              <TableCell><strong>Shteti</strong></TableCell>
              <TableCell><strong>Kodi Postar</strong></TableCell>
              <TableCell><strong>Shteti</strong></TableCell>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Veprime</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map(addr => (
              <TableRow key={addr.id}>
                <TableCell>{addr.id}</TableCell>
                <TableCell>{addr.street}</TableCell>
                <TableCell>{addr.city}</TableCell>
                <TableCell>{addr.state}</TableCell>
                <TableCell>{addr.postalCode}</TableCell>
                <TableCell>{addr.country}</TableCell>
                <TableCell>{addr.userId}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleEdit(addr)} variant="outlined" color="primary">Edito</Button>
                    <Button onClick={() => handleDelete(addr.id)} variant="outlined" color="error">Fshi</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edito Adresën' : 'Shto Adresë'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField label="Street" name="street" value={formData.street || ''} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="City" name="city" value={formData.city || ''} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="State" name="state" value={formData.state || ''} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="Postal Code" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="Country" name="country" value={formData.country || ''} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="User ID" name="userId" value={formData.userId || ''} onChange={handleChange} fullWidth required margin="normal" />

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} color="secondary">Anulo</Button>
              <Button type="submit" variant="contained" color="primary">{editingId ? 'Përditëso' : 'Shto'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingAddress;