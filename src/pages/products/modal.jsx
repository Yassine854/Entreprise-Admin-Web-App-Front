import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert, Grid } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const ProductFormModal = ({ open, handleClose, product, onSave, categoryId: defaultCategoryId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [brand, setBrand] = useState('');
    const [image, setImage] = useState(null);
    const [categoryId, setCategoryId] = useState(defaultCategoryId);
    const [Products, setProducts] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get(`/products/categories/${categoryId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des Produits:', error);
        }
    };

    useEffect(() => {
        fetchProducts();

        if (product) {
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price || '');
            setStock(product.stock || '');
            setBrand(product.brand || '');
            setCategoryId(product.category_id || defaultCategoryId);
            setImage(null);
        } else {
            resetForm();
        }
    }, [product, open, defaultCategoryId]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setBrand('');
        setCategoryId(defaultCategoryId);
        setImage(null);
        setFieldErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('brand', brand);
        formData.append('category_id', categoryId);
        formData.append('user_id', user.id);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (product) {
                await axiosInstance.put(`/products/${product._id}`, formData);
            } else {
                await axiosInstance.post('/products', formData);
            }
            onSave();
            handleClose();
        } catch (error) {
            if (error.response.status === 422) {
                setFieldErrors(error.response.data);
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                handleClose();
                resetForm();
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',  // Increased width
                    maxWidth: 1200,  // Further increased maxWidth
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    height: '90vh',  // Increased height
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ p: 5, borderBottom: '1px solid #ccc' }}>
                        <h2 id="modal-title">
                            {product ? 'Modifier le produit' : 'Ajouter un produit'}
                        </h2>
                        {fieldErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{fieldErrors.general}</Alert>}
                    </Box>
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        error={!!fieldErrors.name}
                                        helperText={fieldErrors.name ? fieldErrors.name.join(' ') : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Marque"
                                        variant="outlined"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        error={!!fieldErrors.brand}
                                        helperText={fieldErrors.brand ? fieldErrors.brand.join(' ') : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Prix"
                                        variant="outlined"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        error={!!fieldErrors.price}
                                        InputProps={{
                                            startAdornment: 'DT'
                                        }}
                                        helperText={fieldErrors.price ? fieldErrors.price.join(' ') : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Quantité"
                                        variant="outlined"
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        error={!!fieldErrors.stock}
                                        helperText={fieldErrors.stock ? fieldErrors.stock.join(' ') : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        variant="outlined"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        error={!!fieldErrors.description}
                                        helperText={fieldErrors.description ? fieldErrors.description.join(' ') : ''}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="file"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        error={!!fieldErrors.image}
                                        helperText={fieldErrors.image ? fieldErrors.image.join(' ') : ''}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                fullWidth
                            >
                                {product ? 'Modifier' : 'Ajouter'}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ProductFormModal;
