import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Grid, CircularProgress, Alert, Typography, Divider } from '@mui/material';
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
                    const response = await axiosInstance.get(`/ShowProduct/${productId}`);
                    setProduct(response.data);
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
                    width: '90%',  // Wider width
                    maxWidth: '1200px',  // Maximum width
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                    maxHeight: '90vh',  // Maximum height
                }}
            >
                <Typography variant="h6" id="modal-title" gutterBottom>
                    Détail du produit
                </Typography>

                {product && (
                    <Grid container spacing={3}>
                        {/* Product Fields */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom"
                                variant="outlined"
                                value={product.name || ''}
                                InputProps={{ readOnly: true }}
                                size="medium"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Marque"
                                variant="outlined"
                                value={product.brand || ''}
                                InputProps={{ readOnly: true }}
                                size="medium"
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
                                size="medium"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Quantité"
                                variant="outlined"
                                type="number"
                                value={product.stock || ''}
                                InputProps={{ readOnly: true }}
                                size="medium"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                value={product.description || ''}
                                multiline
                                rows={5}
                                InputProps={{ readOnly: true }}
                                size="medium"
                            />
                        </Grid>
                        {/* Attributes Section */}
                        <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Attributs du produit
                            </Typography>
                            {product.attributes && product.attributes.length > 0 ? (
                                product.attributes.map((attr, index) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="Attribut"
                                                variant="outlined"
                                                value={attr.attribute.name || 'Non défini'}
                                                InputProps={{ readOnly: true }}
                                                size="medium"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="Valeur"
                                                variant="outlined"
                                                value={attr.value.name || 'Non défini'}
                                                InputProps={{ readOnly: true }}
                                                size="medium"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                fullWidth
                                                label="Quantité"
                                                variant="outlined"
                                                type="number"
                                                value={attr.stock || '0'}
                                                InputProps={{ readOnly: true }}
                                                size="medium"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                fullWidth
                                                label="Prix Unitaire"
                                                variant="outlined"
                                                type="number"
                                                value={attr.unit_price || '0'}
                                                InputProps={{ readOnly: true, startAdornment: 'DT' }}
                                                size="medium"
                                            />
                                        </Grid>
                                    </Grid>
                                ))
                            ) : (
                                <Typography variant="body2">Aucun attribut disponible</Typography>
                            )}
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
                                    maxWidth: 300,         // Maximum width to fit medium size
                                    maxHeight: 300,        // Maximum height to fit medium size
                                    borderRadius: 1,
                                    boxShadow: 2,
                                    display: 'block',
                                    margin: '0 auto',      // Center the image
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
