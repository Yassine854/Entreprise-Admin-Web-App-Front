import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../axiosInstance';
import ProductFormModal from './modal';
import ProductDetailModal from './show'; // Import ProductDetailModal

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false); // State for detail modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success'); // 'success' or 'error'
    const [alertType, setAlertType] = useState(''); // 'create' or 'edit'
    const theme = useTheme();
    const { id: categoryId } = useParams(); // Get category ID from URL parameters

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get(`/products/categories/${categoryId}`);
                setProducts(response.data);
            } catch (error) {
                setError('Échec de la récupération des produits.');
                console.error(error);
            }
        };
        fetchProducts();
    }, [categoryId]);

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
            name: 'Description',
            selector: row => row.description,
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
                        onClick={() => openDetailModal(row)} // Open detail modal
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
            {alertMessage && alertType === 'create' && (
                <Alert severity={alertSeverity} style={{ marginBottom: '1rem' }}>
                    {alertMessage}
                </Alert>
            )}
            {alertMessage && alertType === 'edit' && (
                <Alert severity={alertSeverity} style={{ marginBottom: '1rem' }}>
                    {alertMessage}
                </Alert>
            )}
            {alertMessage && alertType === 'delete' && (
                <Alert severity={alertSeverity} style={{ marginBottom: '1rem' }}>
                    {alertMessage}
                </Alert>
            )}
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
            <DataTable
                columns={columns}
                data={products}
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
