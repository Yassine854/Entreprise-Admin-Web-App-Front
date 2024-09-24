import React, { useState, useEffect } from 'react';
import {
    Modal, FormHelperText, Box, Button, TextField, Autocomplete, Typography, Grid, Divider, IconButton, Card, CardContent, CardMedia, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import axiosInstance from '../../axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateOrderFormModal = ({ open, handleClose, order, onSave }) => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [productAttributes, setProductAttributes] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (open) {
            fetchClients();
            fetchProducts();
        } else {
            resetForm();
        }
    }, [open]);

    useEffect(() => {
        if (order && clients.length > 0) {
            fetchOrder(order._id);
            setIsEditing(true);
        } else {
            resetForm();
        }
    }, [order, clients]);

    useEffect(() => {
        calculateTotalAmount(selectedProducts);
    }, [selectedProducts]);

    const fetchClients = async () => {
        try {
            const response = await axiosInstance.get('/clients');
            setClients(response.data.clients);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get(`/products/${user.id}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchProductAttributes = async (productId) => {
        try {
            const response = await axiosInstance.get(`/ProductAttributes/${productId}`);
            const attributesData = response.data;

            const formattedAttributes = {};
            attributesData.forEach(attr => {
                if (!formattedAttributes[attr.attribute_id]) {
                    formattedAttributes[attr.attribute_id] = {
                        name: attr.attribute.name,
                        values: []
                    };
                }
                formattedAttributes[attr.attribute_id].values.push({
                    _id: attr.value._id,
                    name: attr.value.name
                });
            });

            setProductAttributes(prevAttributes => ({
                ...prevAttributes,
                [productId]: formattedAttributes
            }));
        } catch (error) {
            console.error('Failed to fetch product attributes:', error);
        }
    };

    const fetchOrder = async (id) => {
        try {
            const response = await axiosInstance.get(`/ShowCommande/${id}`);
            const orderData = response.data;
            console.log(orderData);

            // Set the selected client based on orderData.client_id
            setSelectedClient(clients.find(client => client._id === orderData.client_id) || null);

            // Create a Map to ensure unique products
            const uniqueProductsMap = new Map();

            await Promise.all(orderData.products.map(async (p) => {
                await fetchProductAttributes(p.product._id);

                // Check if the product has already been added
                if (!uniqueProductsMap.has(p.product._id)) {
                    uniqueProductsMap.set(p.product._id, {
                        ...p.product,
                        quantity: p.quantity, // Set quantity from the first occurrence
                        attributes: p.product.attributes.reduce((acc, attr) => {
                            acc[attr.attribute_id] = attr.value_id;
                            return acc;
                        }, {}) || {}
                    });
                }
                // If the product is already in the map, do nothing (ensures uniqueness)
            }));

            // Convert the Map back to an array and set the state
            const selectedProducts = Array.from(uniqueProductsMap.values());
            console.log(selectedProducts);

            setSelectedProducts(selectedProducts);
            setTotalAmount(orderData.total_amount);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        }
    };






    const handleProductChange = async (event, newValue) => {
        const newProducts = newValue.map(product => ({
            ...product,
            attributes: selectedProducts.find(p => p._id === product._id)?.attributes || {}
        }));
        setSelectedProducts(newProducts);

        for (const product of newValue) {
            await fetchProductAttributes(product._id);
        }
    };

    const handleAttributeChange = (productId, attributeId, valueId) => {
        setSelectedProducts(prevProducts =>
            prevProducts.map(p =>
                p._id === productId ? {
                    ...p,
                    attributes: {
                        ...p.attributes,
                        [attributeId]: valueId || null // Set to null if no value is selected
                    }
                } : p
            )
        );
    };


    const handleStockChange = (productId, quantity) => {
        setSelectedProducts(prevProducts =>
            prevProducts.map(p =>
                p._id === productId ? {
                    ...p,
                    quantity: Math.max(1, Math.min(parseInt(quantity, 10)))
                } : p
            )
        );
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`product_${productId}`];
            return newErrors;
        });
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(prevProducts =>
            prevProducts.filter(p => p._id !== productId)
        );
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`product_${productId}`];
            return newErrors;
        });
        setProductAttributes(prevAttributes => {
            const newAttributes = { ...prevAttributes };
            delete newAttributes[productId];
            return newAttributes;
        });
    };

    const calculateTotalAmount = (products) => {
        const total = products.reduce((sum, product) => {
            const quantity = product.quantity || 1;
            const price = parseFloat(product.price) || 0;
            return sum + (price * quantity);
        }, 0);
        setTotalAmount(total);
    };

    const resetForm = () => {
        setSelectedClient(null);
        setSelectedProducts([]);
        setTotalAmount(0);
        setIsEditing(false);
        setErrors({});
        setProductAttributes({});
    };

    const handleSave = async () => {
        try {
            const orderData = {
                admin_id: user.id,
                client_id: selectedClient?._id,
                products: selectedProducts.map(product => {
                    const attributesArray = Object.keys(product.attributes).map(attrId => ({
                        attribute_id: attrId,
                        value_id: product.attributes[attrId] || null // Include null if no value selected
                    }));

                    return {
                        _id: product._id,
                        attributes: [
                            {
                                quantity: product.quantity || 1,
                                attributes: attributesArray
                            }
                        ]
                    };
                }),
                total_amount: totalAmount,
            };

            if (isEditing) {
                await axiosInstance.put(`/commandes/${order._id}`, orderData);
            } else {
                await axiosInstance.post('/commandes', orderData);
            }

            handleClose();
            onSave();
        } catch (error) {
            console.error('Failed to save order:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...error.response.data.errors // Merge in the errors directly
                }));

            } else {
                setErrors({ general: 'Une erreur s\'est produite lors de l\'enregistrement.' });
            }
        }
    };



    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="order-form-modal">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%', // Increase width
                    maxWidth: 'none', // Remove maxWidth
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    height: '95vh', // Increase height
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ p: 5, borderBottom: '1px solid #ccc' }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {isEditing ? 'Modifier Commande' : 'Ajouter Commande'}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                    </Box>
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    value={selectedClient}
                                    onChange={(event, newValue) => setSelectedClient(newValue)}
                                    options={clients}
                                    getOptionLabel={(option) => option.name || ''}
                                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Client"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.client_id}
                                            helperText={errors.client_id || ''}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    value={selectedProducts}
                                    onChange={handleProductChange}
                                    options={products}
                                    getOptionLabel={(option) => option.name || ''}
                                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Produits"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.products}
                                            helperText={errors.products ? 'Veuillez sélectionner des produits.' : ''}
                                        />
                                    )}
                                />
                            </Grid>
                            {selectedProducts.map(product => (
                                <Grid container spacing={3} key={product._id} alignItems="center">
                                    <Grid item xs={12}>
                                        <Card sx={{ display: 'flex', mb: 3, alignItems: 'flex-start', p: 2 }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1, mr: 2, ml: 2 }}
                                                image={product.image ? `https://example.shop/storage/img/products/${product.image}` : `https://example.shop/storage/img/NoImage.png`}
                                                alt={product.name}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <CardContent>
                                                    <Typography variant="h6">{product.name}</Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Prix vente: {parseFloat(product.price).toFixed(2)} DT
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Stock: {product.stock}
                                                    </Typography>

                                                    {productAttributes[product._id] && (
                                                        <Box sx={{ mt: 2 }}>
                                                            {Object.keys(productAttributes[product._id]).map(attrId => (
                                                                <FormControl key={attrId} fullWidth sx={{ mb: 2 }}>
                                                                    <InputLabel>{productAttributes[product._id][attrId].name}</InputLabel>
                                                                    <Select
                                                                        value={product.attributes[attrId] || ''}
                                                                        onChange={(e) => handleAttributeChange(product._id, attrId, e.target.value)}
                                                                        label={productAttributes[product._id][attrId].name}
                                                                        error={!!errors[`products.${selectedProducts.findIndex(p => p._id === product._id)}.attributes.${attrId}.value_id`]}
                                                                    >
                                                                        {productAttributes[product._id][attrId].values.map(value => (
                                                                            <MenuItem key={value._id} value={value._id}>
                                                                                {value.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                    <FormHelperText error={!!errors[`products.${selectedProducts.findIndex(p => p._id === product._id)}.attributes.0.attributes`]}>
                                                                        {errors[`products.${selectedProducts.findIndex(p => p._id === product._id)}.attributes.0.attributes`]?.[0] || ''}
                                                                    </FormHelperText>


                                                                    <FormHelperText
                                                                        error={!!errors[`products.${selectedProducts.findIndex(p => p._id === product._id)}.attributes.${Object.keys(productAttributes[product._id]).indexOf(attrId)}.quantity`]}
                                                                    >

                                                                        {errors[`products.${selectedProducts.findIndex(p => p._id === product._id)}.attributes.${Object.keys(productAttributes[product._id]).indexOf(attrId)}.quantity`]?.[0] || ''}
                                                                    </FormHelperText>
                                                                </FormControl>
                                                            ))}

                                                            <TextField
                                                                label="Quantité"
                                                                type="number"
                                                                inputProps={{
                                                                    min: 1,
                                                                }}
                                                                value={product.quantity || 1}
                                                                onChange={(e) => handleStockChange(product._id, e.target.value)}
                                                                variant="outlined"
                                                                fullWidth
                                                                sx={{ mt: 1 }}


                                                            />
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveProduct(product._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            ))}

                        </Grid>
                        {errors && (
                            <Box sx={{ mb: 2 }}>
                                {typeof errors === 'string' ? (
                                    <Typography variant="body2" color="error">
                                        {errors}
                                    </Typography>
                                ) : (
                                    Object.values(errors).map((error, index) => (
                                        <Typography key={index} variant="body2" color="error" sx={{ mb: 1 }}>
                                            {error}
                                            <br />
                                        </Typography>
                                    ))
                                )}
                            </Box>
                        )}




                    </Box>
                    <Box sx={{ p: 2, borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Total: {totalAmount.toFixed(2)} DT</Typography>

                        <Box>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                {isEditing ? 'Sauvegarder' : 'Ajouter'}
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                            >
                                Annuler
                            </Button>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Modal>
    );
};

export default CreateOrderFormModal;
