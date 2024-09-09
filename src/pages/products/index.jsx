import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Alert, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../axiosInstance';
import ProductFormModal from './modal';
import ProductDetailModal from './show';
import { Typography, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertType, setAlertType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const theme = useTheme();
    const { id: categoryId } = useParams();
    const location = useLocation();
    const categoryName = location.state?.categoryName || 'Catégorie';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get(`/products/categories/${categoryId}`);
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                setError('Échec de la récupération des produits.');
                console.error(error);
            }
        };
        fetchProducts();
    }, [categoryId]);

    const handleSearch = () => {
        const filtered = products.filter(product =>
            product[searchCriteria].toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, searchCriteria, products]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');
        if (confirmed) {
            try {
                await axiosInstance.delete(`/products/${id}`);
                setProducts(products.filter(product => product._id !== id));
                setAlertMessage('Produit supprimé avec succès.');
                setAlertSeverity('success');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            } catch (error) {
                setAlertMessage('Échec de la suppression du produit.');
                setAlertSeverity('error');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            }
        }
    };

    const openModalForEdit = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
        setAlertType('');
    };

    const openModalForCreate = () => {
        setSelectedProduct(null);
        setModalOpen(true);
        setAlertType('');
    };

    const openDetailModal = (product) => {
        setSelectedProduct(product);
        setDetailModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.get(`/products/categories/${categoryId}`);
            setProducts(response.data);
            setFilteredProducts(response.data);
            if (selectedProduct) {
                setAlertMessage('Produit modifié avec succès.');
                setAlertSeverity('success');
                setAlertType('edit');
            } else {
                setAlertMessage('Produit ajouté avec succès.');
                setAlertSeverity('success');
                setAlertType('create');
            }
        } catch (error) {
            console.log(error);
            setAlertMessage('Échec de la mise à jour des produits.');
            setAlertSeverity('error');
            setAlertType(selectedProduct ? 'edit' : 'create');
        } finally {
            setTimeout(() => {
                setAlertMessage('');
                setAlertType('');
                setModalOpen(false);
                setDetailModalOpen(false);
            }, 3000);
        }
    };

    const columns = [
        {
            name: 'Nom',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Marque',
            selector: row => row.brand,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => openDetailModal(row)}
                        startIcon={<EyeOutlined />}
                    >
                        Détails
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => openModalForEdit(row)}
                        startIcon={<EditOutlined />}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row._id)}
                        startIcon={<DeleteOutlined />}
                    >
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Container maxWidth={false} disableGutters>
            {alertMessage && (
                <Alert severity={alertSeverity} style={{ marginBottom: '1rem' }}>
                    {alertMessage}
                </Alert>
            )}
            <Grid item xs={12}>
    <Typography variant="h5" gutterBottom>
    {`Catégorie: ${categoryName}`}
</Typography>
</Grid>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={openModalForCreate}
                startIcon={<PlusOutlined />}
            >
                Ajouter
            </Button>
            {error && <p>{error}</p>}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                    <InputLabel>Critère</InputLabel>
                    <Select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        label="Critère"
                    >
                        <MenuItem value="name">Nom</MenuItem>
                        <MenuItem value="brand">Marque</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Rechercher"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: '300px' }}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredProducts}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />
            <ProductFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                product={selectedProduct}
                onSave={handleSave}
                categoryId={categoryId}
            />
            <ProductDetailModal
                open={detailModalOpen}
                handleClose={() => setDetailModalOpen(false)}
                productId={selectedProduct?._id}
            />
        </Container>
    );
};

export default ProductList;
