import React, { useState, useEffect } from 'react';
import {
    Modal, Box, Button, TextField, Autocomplete, Typography, Grid, Divider, IconButton, Card, CardContent, CardMedia, Select, MenuItem, InputLabel, FormControl
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

            // Transform attributes data into a more usable format
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
            setSelectedClient(clients.find(client => client._id === orderData.user_id) || null);
            setSelectedProducts(orderData.products.map(p => ({
                ...p.product,
                attributes: p.attributes || {}
            })));
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

        // Fetch attributes for newly selected products
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
                        [attributeId]: {
                            ...p.attributes[attributeId],
                            value_id: valueId
                        }
                    }
                } : p
            )
        );
    };



    const handleStockChange = (productId, quantity) => {
        console.log('Updating quantity:', productId, quantity);
        setSelectedProducts(prevProducts =>
            prevProducts.map(p =>
                p._id === productId ? {
                    ...p,
                    quantity: Math.max(1, Math.min(parseInt(quantity, 10), p.stock))
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
            const quantity = product.quantity || 1; // Default quantity to 1 if not set
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
                    const attributesArray = Object.keys(product.attributes).map(attrId => {
                        const attribute = product.attributes[attrId];
                        return {
                            attribute_id: attrId,
                            value_id: attribute.value_id // Assuming value_id is stored in attributes
                        };
                    });

                    return {
                        _id: product._id,
                        attributes: [
                            {
                                quantity: product.quantity || 1, // Manage quantity separately
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
                console.log(orderData);
                await axiosInstance.post('/commandes', orderData);
            }

            handleClose();
            onSave();
        } catch (error) {
            console.error('Failed to save order:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
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
                    width: '95%',
                    maxWidth: 1200,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    height: '90vh',
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
                                            {product.image && (
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1, mr: 2, ml: 2 }}
                                                    image={`https://example.shop/storage/img/products/${product.image}`}
                                                    alt={product.name}
                                                />
                                            )}
                                            {!product.image && (
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1, mr: 2, ml: 2 }}
                                                    image={`https://example.shop/storage/img/NoImage.png`}
                                                    alt={product.name}
                                                />
                                            )}
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
                    value={product.attributes?.[attrId]?.value_id || ''}
                    onChange={(e) => handleAttributeChange(product._id, attrId, e.target.value)}
                    label={productAttributes[product._id][attrId].name}
                >
                    {productAttributes[product._id][attrId].values.map(value => (
                        <MenuItem key={value._id} value={value._id}>
                            {value.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        ))}
    </Box>
)}

<TextField
    label="Quantité"
    type="number"
    inputProps={{
        min: 1,
        max: product.stock
    }}
    value={product.quantity || 1}
    onChange={(e) => handleStockChange(product._id, e.target.value)}
    variant="outlined"
    fullWidth
    sx={{ mt: 1 }}
    error={!!errors[`product_${product._id}`]}
    helperText={errors[`product_${product._id}`] || ''}
/>


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
                            <Grid item xs={12}>
                                <Typography variant="h6">Total: {totalAmount.toFixed(2)} DT</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ p: 2, borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'flex-end' }}>
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
        </Modal>
    );
};

export default CreateOrderFormModal;
