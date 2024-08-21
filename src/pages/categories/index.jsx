// src/components/CategoryList.js
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../axiosInstance';
import CategoryFormModal from './modal';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success'); // 'success' or 'error'
    const [alertType, setAlertType] = useState(''); // 'create' or 'edit'
    const theme = useTheme();
    const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(`/categories/${user.id}`);
                setCategories(response.data);
            } catch (error) {
                setError('Échec de la récupération des catégories.');
                console.error(error);
            }
        };
        fetchCategories();
    }, [user.id]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
        if (confirmed) {
            try {
                await axiosInstance.delete(`/categories/${id}`);
                setCategories(categories.filter(category => category._id !== id));
                setAlertMessage('Catégorie supprimée avec succès.');
                setAlertSeverity('success');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            } catch (error) {
                setAlertMessage('Échec de la suppression de la catégorie.');
                setAlertSeverity('error');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            }
        }
    };

    const openModalForEdit = (category) => {
        setSelectedCategory(category);
        setModalOpen(true);
        setAlertType('');
    };

    const openModalForCreate = () => {
        setSelectedCategory(null);
        setModalOpen(true);
        setAlertType('');
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.get(`/categories/${user.id}`);
            setCategories(response.data);
            if (selectedCategory) {
                setAlertMessage('Catégorie modifiée avec succès.');
                setAlertSeverity('success');
                setAlertType('edit');
            } else {
                setAlertMessage('Catégorie ajoutée avec succès.');
                setAlertSeverity('success');
                setAlertType('create');
            }
        } catch (error) {
            setAlertMessage('Échec de la mise à jour des catégories.');
            setAlertSeverity('error');
            setAlertType(selectedCategory ? 'edit' : 'create');
        } finally {
            setTimeout(() => {
                setAlertMessage('');
                setAlertType('');
                setModalOpen(false);
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
                        onClick={() => openModalForEdit(row)}
                        startIcon={<EditIcon />}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row._id)}
                        startIcon={<DeleteIcon />}
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
                startIcon={<AddIcon />}
            >
                Ajouter
            </Button>
            {error && <p>{error}</p>}
            <DataTable
                columns={columns}
                data={categories}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />
            <CategoryFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                category={selectedCategory}
                onSave={handleSave}
            />
        </Container>
    );
};

export default CategoryList;
