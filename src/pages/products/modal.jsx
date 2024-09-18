import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert, Grid, MenuItem, IconButton, Typography, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axiosInstance from '../../axiosInstance';

const ProductFormModal = ({ open, handleClose, product, onSave, categoryId: defaultCategoryId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [brand, setBrand] = useState('');
    const [image, setImage] = useState(null);
    const [categoryId, setCategoryId] = useState(defaultCategoryId);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([{ attribute_id: '', value_id: '', stock: '', unit_price: '' }]);
    const [fieldErrors, setFieldErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    const errorMessages = {
        'attributes.*.attribute_id': 'Veuillez sélectionner un attribut valide.',
        'attributes.*.value_id': 'Veuillez sélectionner une valeur valide.',
        'attributes.*.stock': 'La quantité en stock est requise.',
        'attributes.*.unit_price': 'Le prix unitaire est requis.',
        'name': 'Le nom du produit est requis.',
        'price': 'Le prix est requis.',
        'stock': 'La quantité en stock est requise.',
    };

    // Fetch attributes and their values
    const fetchAttributes = async () => {
        try {
            const response = await axiosInstance.get('/attributes');
            setAttributes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des attributs:', error);
        }
    };

    useEffect(() => {
        fetchAttributes();

        if (product) {
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price || '');
            setStock(product.stock || '');
            setBrand(product.brand || '');
            setCategoryId(product.category_id || defaultCategoryId);
            setImage(null);
            setSelectedAttributes(product.attributes || [{ attribute_id: '', value_id: '', stock: '', unit_price: '' }]);
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
        setSelectedAttributes([{ attribute_id: '', value_id: '', stock: '', unit_price: '' }]);
        setFieldErrors({});
    };

    const handleAttributeChange = (index, field, value) => {
        const newAttributes = [...selectedAttributes];
        if (field === 'stock' && value < 0) {
            return; // Prevent stock from going below 0
        }
        if (field === 'unit_price' && isNaN(value)) {
            return; // Prevent invalid unit price
        }
        newAttributes[index][field] = value;
        setSelectedAttributes(newAttributes);
    };

    const addAttributeRow = () => {
        setSelectedAttributes([...selectedAttributes, { attribute_id: '', value_id: '', stock: '', unit_price: '' }]);
    };

    const removeAttributeRow = (index) => {
        const newAttributes = selectedAttributes.filter((_, i) => i !== index);
        setSelectedAttributes(newAttributes);
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

        selectedAttributes.forEach((attr, index) => {
            formData.append(`attributes[${index}][attribute_id]`, attr.attribute_id);
            formData.append(`attributes[${index}][value_id]`, attr.value_id);
            formData.append(`attributes[${index}][stock]`, attr.stock);
            formData.append(`attributes[${index}][unit_price]`, attr.unit_price);
        });

        try {
            if (product) {
                await axiosInstance.post(`/products/${product._id}`, formData);
            } else {
                await axiosInstance.post('/products', formData);
            }
            onSave();
            handleClose();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Formater les erreurs avec les messages personnalisés
                const formattedErrors = Object.keys(error.response.data.errors).reduce((acc, key) => {
                    acc[key] = errorMessages[key] || error.response.data.errors[key];
                    return acc;
                }, {});
                setFieldErrors(formattedErrors);
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
                    width: '80%',
                    maxWidth: 1400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    {product ? 'Modifier le produit' : 'Ajouter un produit'}
                </Typography>
                {fieldErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{fieldErrors.general}</Alert>}

                <Divider sx={{ mb: 2 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Product Fields */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name || ''}
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
                                helperText={fieldErrors.brand || ''}
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
                                InputProps={{ startAdornment: 'DT' }}
                                helperText={fieldErrors.price || ''}
                                inputProps={{ step: '0.01' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Quantité"
                                variant="outlined"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(Math.max(0, e.target.value))}
                                error={!!fieldErrors.stock}
                                helperText={fieldErrors.stock || ''}
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
                                helperText={fieldErrors.description || ''}
                                multiline
                                rows={4}
                            />
                        </Grid>


                        {/* Attributes Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Attributs du produit
                            </Typography>
                            {selectedAttributes.map((attr, index) => (
                                <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Attribut"
                                            value={attr.attribute_id}
                                            onChange={(e) => handleAttributeChange(index, 'attribute_id', e.target.value)}
                                            error={!!fieldErrors[`attributes.${index}.attribute_id`]}
                                            helperText={fieldErrors[`attributes.${index}.attribute_id`] || ''}
                                        >
                                            {attributes.map((attribute) => (
                                                <MenuItem key={attribute._id} value={attribute._id}>
                                                    {attribute.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Valeur"
                                            value={attr.value_id}
                                            onChange={(e) => handleAttributeChange(index, 'value_id', e.target.value)}
                                            error={!!fieldErrors[`attributes.${index}.value_id`]}
                                            helperText={fieldErrors[`attributes.${index}.value_id`] || ''}
                                        >
                                            {/* Ensure MenuItem is rendered even if no value_id is set */}
                                            {attr.attribute_id
                                                ? attributes.find(a => a._id === attr.attribute_id)?.values.map((val) => (
                                                    <MenuItem key={val._id} value={val._id}>
                                                        {val.name}
                                                    </MenuItem>
                                                ))
                                                : <MenuItem value="">Aucun attribut sélectionné</MenuItem>
                                            }
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            fullWidth
                                            label="Quantité"
                                            variant="outlined"
                                            type="number"
                                            value={attr.stock}
                                            onChange={(e) => handleAttributeChange(index, 'stock', Math.max(0, e.target.value))}
                                            error={!!fieldErrors[`attributes.${index}.stock`]}
                                            helperText={fieldErrors[`attributes.${index}.stock`] || ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            fullWidth
                                            label="Prix Unitaire"
                                            variant="outlined"
                                            type="number"
                                            value={attr.unit_price}
                                            onChange={(e) => handleAttributeChange(index, 'unit_price', e.target.value)}
                                            error={!!fieldErrors[`attributes.${index}.unit_price`]}
                                            helperText={fieldErrors[`attributes.${index}.unit_price`] || ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <IconButton color="error" onClick={() => removeAttributeRow(index)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button onClick={addAttributeRow} startIcon={<AddCircleOutlineIcon />}>
                                Ajouter un attribut
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                error={!!fieldErrors.image}
                                helperText={fieldErrors.image || ''}
                            />
                        </Grid>

                        {/* Form Actions */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                                {product ? 'Modifier' : 'Ajouter'}
                            </Button>
                            <Button onClick={handleClose} variant="outlined" color="secondary">
                                Annuler
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default ProductFormModal;
