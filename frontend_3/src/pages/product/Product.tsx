import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Stack,
    FormControl, InputLabel, Select, MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { CategoryDto } from '../category/Category'; 
import { AuthContext } from '../../auth/auth.context';
import { getSession } from '../../auth/auth.utils';
import { IAuthContext } from '../../types/auth.types';

interface ProductDto {
    id?: string; // MongoDB uses id
    productName: string;
    description: string;
    price: number;
    categoryId: string;
    userId?: string; 
    userInfo?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface ProductCreateDto {
    productName: string;
    description: string;
    price: number;
    categoryId: string;
}

const Product: React.FC = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [formData, setFormData] = useState<Partial<ProductCreateDto>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const { isAuthenticated } = useContext(AuthContext) as IAuthContext; 

    const productApiUrl = 'https://localhost:7039/api/Product';
    const categoryApiUrl = 'https://localhost:7039/api/Category'; 

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<ProductDto[]>(productApiUrl);
            setProducts(response.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së produkteve:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get<CategoryDto[]>(categoryApiUrl);
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
   const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({
        ...prev,
        categoryId: event.target.value as string
    }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = getSession();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        if (editingId) {
            const originalProduct = products.find(p => p.id === editingId);
            if (!originalProduct) throw new Error('Produkti nuk u gjet');

            const updatedProduct: ProductDto = {
                id: editingId,
                productName: formData.productName!,
                description: formData.description!,
                price: Number(formData.price!),
                categoryId: formData.categoryId!,
                userId: originalProduct.userId!, 
                userInfo: originalProduct.userInfo!, 
            };

            await axios.put(productApiUrl, updatedProduct, { headers }); 
        } else {
            await axios.post(productApiUrl, formData, { headers });
        }

        setFormData({});
        setEditingId(null);
        setOpenModal(false);
        fetchProducts();
    } catch (error: any) {
        console.error('Gabim gjatë ruajtjes së produktit:', error);
        if (error.response?.status === 401) console.log("Unauthorized");
    }
};


    const handleEdit = (product: ProductDto) => {
        setFormData({
            productName: product.productName,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
        });
        setEditingId(product.id || null);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setFormData({});
        setEditingId(null);
        setOpenModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('A jeni i sigurt që dëshironi të fshini këtë produkt?')) {
            try {
                await axios.delete(`${productApiUrl}/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Gabim gjatë fshirjes së produktit:', error);
            }
        }
    };
    

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Menaxhimi i Produkteve</h2>

            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
                Shto Produkt
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Emri</strong></TableCell>
                            <TableCell><strong>Përshkrimi</strong></TableCell>
                            <TableCell><strong>Çmimi</strong></TableCell>
                            <TableCell><strong>Kategoria ID</strong></TableCell>
                            <TableCell><strong>Veprime</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                {
                                    categories.find(c => c.id === product.categoryId)?.categoryName ?? 'Pa kategori'
                                }
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Button onClick={() => handleEdit(product)} variant="outlined" color="primary">Edito</Button>
                                        <Button onClick={() => handleDelete(product.id!)} variant="outlined" color="error">Fshi</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal për Shtim/Redaktim Produkti */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{editingId ? 'Edito Produktin' : 'Shto Produkt'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Emri i Produktit"
                            name="productName"
                            value={formData.productName || ''}
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
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Çmimi"
                            name="price"
                            type="number"
                            value={formData.price || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="category-label">Kategoria</InputLabel>
                            <Select
                                labelId="category-label"
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId || ''}
                                label="Kategoria"
                                onChange={handleCategoryChange} 
                            >
                                {categories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

export default Product;