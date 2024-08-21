import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const CategoryFormModal = ({ open, handleClose, category, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || ''); // Ensure description can be empty
        } else {
            // Clear form fields when modal is closed or no category is provided
            setName('');
            setDescription('');
        }
    }, [category, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name, description, user_id: user.id };

        try {
            if (category) {
                await axiosInstance.put(`/categories/${category._id}`, payload);
            } else {
                await axiosInstance.post('/categories', payload);
            }
            onSave(); // Refresh the category list
            handleClose(); // Close the modal
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Erreur lors de l\'enregistrement de la catégorie.'); // Set error message
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                handleClose();
                setName(''); // Clear form data on close
                setDescription(''); // Clear form data on close
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
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2 id="modal-title">{category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h2>
                {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nom"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary">
                            Enregistrer
                        </Button>
                        <Button onClick={() => {
                            handleClose();
                            setName(''); // Clear form data on close
                            setDescription(''); // Clear form data on close
                        }} variant="outlined" color="secondary">
                            Annuler
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CategoryFormModal;
