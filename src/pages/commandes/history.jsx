import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const OrderFormModal = ({ open, handleClose, order, products, onSave }) => {
    const [formState, setFormState] = useState({
        user_id: '',
        products: [],
        total_amount: 0,
        status: 'pending'
    });

    useEffect(() => {
        if (order) {
            setFormState({
                user_id: order.user_id,
                products: order.products,
                total_amount: order.total_amount,
                status: order.status,
            });
        } else {
            setFormState({
                user_id: '',
                products: [],
                total_amount: 0,
                status: 'pending'
            });
        }
    }, [order]);

    const handleProductChange = (index, field, value) => {
        const newProducts = [...formState.products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setFormState({ ...formState, products: newProducts });
    };

    const calculateTotalAmount = () => {
        return formState.products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (order) {
                // Update existing order
                await axiosInstance.put(`/commandes/${order.id}`, formState);
            } else {
                // Create new order
                await axiosInstance.post('/commandes', formState);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save order:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style, width: 400 }}>
                <Typography variant="h6" component="h2">
                    {order ? 'Edit Order' : 'Add Order'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="User ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formState.user_id}
                        onChange={(e) => setFormState({ ...formState, user_id: e.target.value })}
                    />
                    {formState.products.map((product, index) => (
                        <Box key={index} mb={2}>
                            <TextField
                                select
                                label="Product"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={product.id}
                                onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                                SelectProps={{ native: true }}
                            >
                                <option value="">Select a product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </TextField>
                            <TextField
                                label="Quantity"
                                type="number"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            />
                        </Box>
                    ))}
                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => setFormState({
                            ...formState,
                            products: [...formState.products, { id: '', quantity: 1 }]
                        })}
                    >
                        Add Product
                    </Button>
                    <Box mt={2}>
                        <Typography>Total Amount: ${calculateTotalAmount().toFixed(2)}</Typography>
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Save Order
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default OrderFormModal;
