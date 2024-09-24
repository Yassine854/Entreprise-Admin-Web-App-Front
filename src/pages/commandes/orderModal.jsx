import React, { useState, useEffect } from 'react';
import {
    Modal, Box, MenuItem, InputLabel, Select, Button, TextField, Typography, Divider, IconButton, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import axiosInstance from '../../axiosInstance';

const CreateOrderFormModal = ({ open, handleClose, order, onSave }) => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([{ productId: '', quantity: 1, attributes: {} }]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [errors, setErrors] = useState({});
    const [productAttributes, setProductAttributes] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (open) {
            setErrors({});
            setSelectedClient(null);
            setSelectedProducts([{ productId: '', quantity: 1, attributes: {} }]);
            setTotalAmount(0);
            fetchClients();
            fetchProducts();
        }
    }, [open]);

    useEffect(() => {
        if (order) {
            setSelectedClient(order.user);
            setSelectedProducts(order.products.map(product => ({
                productId: product.product_id,
                quantity: product.quantity,
                attributes: product.attributes.reduce((acc, attr) => {
                    acc[attr.attribute_id] = attr.value_id;
                    return acc;
                }, {})
            })));
            calculateTotalAmount(order.products);
        } else {
            setSelectedProducts([{ productId: '', quantity: 1, attributes: {} }]);
        }
    }, [order]);

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

    const handleProductChange = (index, product) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].productId = product?._id || '';
        updatedProducts[index].attributes = {};
        setSelectedProducts(updatedProducts);
        fetchProductAttributes(product?._id);
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].quantity = parseInt(quantity, 10) || 1;
        setSelectedProducts(updatedProducts);
    };

    const handleAttributeChange = (index, attrId, valueId) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].attributes[attrId] = valueId;
        setSelectedProducts(updatedProducts);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        const newProducts = [...selectedProducts, { productId: '', quantity: 1, attributes: {} }];
        setSelectedProducts(newProducts);
        calculateTotalAmount(newProducts);
    };

    const calculateTotalAmount = (selectedProducts) => {
        const total = selectedProducts.reduce((sum, product) => {
            const productData = products.find(prod => prod._id === product.productId);
            const price = parseFloat(productData?.price) || 0;
            return sum + (price * product.quantity);
        }, 0);
        setTotalAmount(total);
    };

    const handleSave = async () => {
        const orderData = {
            admin_id: user.id,
            user_id: selectedClient?._id,
            products: selectedProducts.map(product => ({
                product_id: product.productId,
                quantity: product.quantity,
                attributes: Object.keys(product.attributes).map(attrId => ({
                    attribute_id: attrId,
                    value_id: product.attributes[attrId],
                })),
            })),
            total_amount: totalAmount,
        };

        try {
            if (order) {
                await axiosInstance.put(`/commandes/${order._id}`, orderData);
            } else {
                await axiosInstance.post('/commandes', orderData);
            }
            handleClose();
            onSave();
        } catch (error) {
            console.error('Failed to save order:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors({ general: error.response.data.error });
            } else {
                setErrors({ general: "Une erreur s'est produite lors de l'enregistrement de la commande." });
            }
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="order-form-modal">
            <Box sx={modalStyle}>
                <Typography variant="h6">{order ? 'Modifier Commande' : 'Ajouter Commande'}</Typography>
                <Divider sx={{ my: 2 }} />

                <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => setSelectedClient(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Client"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.user_id)}
                            helperText={errors.user_id && errors.user_id[0]}
                        />
                    )}
                    value={selectedClient}
                    sx={{ mb: 2 }}
                />

                <Box>
                    {selectedProducts.map((product, index) => (
                        <div key={index} style={{ marginBottom: '16px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => handleProductChange(index, newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Produit"
                                        variant="outlined"
                                        error={Boolean(errors[`products.${index}.product_id`])}
                                        helperText={errors[`products.${index}.product_id`] && errors[`products.${index}.product_id`][0]}
                                    />
                                )}
                                value={products.find(prod => prod._id === product.productId) || null}
                            />

                            {product.productId && products.find(prod => prod._id === product.productId) && (
                                <div style={{ marginBottom: '8px', color: '#555' }}>
                                    <Typography variant="body2">
                                        Stock: {products.find(prod => prod._id === product.productId).stock} unités
                                    </Typography>
                                    <Typography variant="body2">
                                        Prix vente: {products.find(prod => prod._id === product.productId).price} Dt
                                    </Typography>
                                    <img
src={`https://example.shop/storage/img/products/${products.find(prod => prod._id === product.productId).image}`}
alt={products.find(prod => prod._id === product.productId).name}
                                        style={{ maxWidth: '100px', marginTop: '8px' }}
                                    />
                                </div>
                            )}

                            {product.productId && productAttributes[product.productId] && Object.keys(productAttributes[product.productId]).map(attrId => (
                                <FormControl fullWidth key={attrId} sx={{ mb: 2 }}>
                                    <InputLabel>{productAttributes[product.productId][attrId].name}</InputLabel>
                                    <Select
                                        value={product.attributes[attrId] || ''}
                                        onChange={(e) => handleAttributeChange(index, attrId, e.target.value)}
                                        error={Boolean(errors[`products.${index}.attributes.${attrId}`])}
                                    >
                                        {productAttributes[product.productId][attrId].values.map(value => (
                                            <MenuItem key={value._id} value={value._id}>
                                                {value.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors[`products.${index}.attributes.${attrId}`] && (
                                        <Typography color="error" variant="caption">
                                            {errors[`products.${index}.attributes.${attrId}`][0]}
                                        </Typography>
                                    )}
                                </FormControl>
                            ))}
                <br />
                            <TextField
                                type="number"
                                label="Quantité"
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                error={Boolean(errors[`products.${index}.quantity`])}
                                helperText={errors[`products.${index}.quantity`] && errors[`products.${index}.quantity`][0]}
                            />

                            <IconButton onClick={() => handleRemoveProduct(index)} color="secondary">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}

                    <Button variant="contained" color="primary" onClick={handleAddProduct}>
                        + Produit
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Total : {totalAmount.toFixed(2)} DT</Typography>

                {errors.general && <Typography color="error">{errors.general}</Typography>}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                        {order ? 'Modifier' : 'Ajouter'}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>Annuler</Button>
                </Box>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%', // Adjusted to be larger
    maxWidth: '1500px', // Increased maximum width
    maxHeight: '100vh', // Increased maximum height
    overflowY: 'auto', // Enable scrolling for the entire modal
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};


export default CreateOrderFormModal;

