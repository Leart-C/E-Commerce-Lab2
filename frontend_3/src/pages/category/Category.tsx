import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';

interface CategoryDto {
  id?: string;
  categoryName: string;
  description: string;
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [formData, setFormData] = useState<Partial<CategoryDto>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const apiUrl = 'https://localhost:7039/api/Category';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(apiUrl);
      setCategories(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së kategorive:', error);
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
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, formData);
      } else {
        await axios.post(apiUrl, formData);
      }
      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Gabim gjatë ruajtjes së kategorisë:', error);
    }
  };

  const handleEdit = (category: CategoryDto) => {
    setFormData(category);
    setEditingId(category.id || null);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('A jeni i sigurt që dëshironi të fshini këtë kategori?')) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Gabim gjatë fshirjes së kategorisë:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Menaxhimi i Kategorive</h2>

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Shto Kategori
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Emri i Kategorisë</strong></TableCell>
              <TableCell><strong>Përshkrimi</strong></TableCell>
              <TableCell><strong>Veprime</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleEdit(category)} variant="outlined" color="primary">Edito</Button>
                    <Button onClick={() => handleDelete(category.id!)} variant="outlined" color="error">Fshi</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal për Shtim/Redaktim */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingId ? 'Edito Kategorinë' : 'Shto Kategori'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Emri i Kategorisë"
              name="categoryName"
              value={formData.categoryName || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Përshkrimi"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
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

export default Category;