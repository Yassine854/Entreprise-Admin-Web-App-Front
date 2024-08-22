import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Grid, CircularProgress, Alert, Typography } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const ProductDetailModal = ({ open, handleClose, productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && productId) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(`/products/${productId}`);
                    setProduct(response.data);
                    console.log(response.data);
                    setError('');
                } catch (error) {
                    console.error('Erreur lors de la récupération du produit:', error);
                    setError('Erreur lors de la récupération des détails du produit.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [open, productId]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '50%' },  // Adjusted width for smaller size
                    maxWidth: 600,  // Optional: to set a max width
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 2,  // Reduced padding for a more compact look
                    overflow: 'auto',
                }}
            >
                <h2 id="modal-title">Détails du produit</h2>
                {product && (
                    <Grid container spacing={1}>  {/* Reduced spacing for a tighter layout */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom"
                                variant="outlined"
                                value={product.name || ''}
                                InputProps={{ readOnly: true }}
                                size="small"  // Smaller input size
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Marque"
                                variant="outlined"
                                value={product.brand || ''}
                                InputProps={{ readOnly: true }}
                                size="small"  // Smaller input size
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Prix"
                                variant="outlined"
                                type="number"
                                value={product.price || ''}
                                InputProps={{ readOnly: true, startAdornment: 'DT' }}
                                size="small"  // Smaller input size
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Stock"
                                variant="outlined"
                                type="number"
                                value={product.stock || ''}
                                InputProps={{ readOnly: true }}
                                size="small"  // Smaller input size
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                value={product.description || ''}
                                multiline
                                rows={3}  // Reduced number of rows for a more compact look
                                InputProps={{ readOnly: true }}
                                size="small"  // Smaller input size
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" gutterBottom>
                                Image:
                            </Typography>
                            {product.image ? (
                                <Box
                                    component="img"
                                    src={`https://example.shop/storage/img/products/${product.image}`}
                                    alt={product.name}
                                    sx={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        maxHeight: 200,  // Reduced max height for image
                                        borderRadius: 1,
                                        boxShadow: 2,
                                        display: 'block',
                                        margin: '0 auto',  // Center image
                                    }}
                                />
                            ) : (
                                <Typography variant="body2">Aucune image disponible</Typography>
                            )}
                        </Grid>
                    </Grid>
                )}
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '1rem' }}
                    fullWidth
                >
                    Fermer
                </Button>
            </Box>
        </Modal>
    );
};

export default ProductDetailModal;
