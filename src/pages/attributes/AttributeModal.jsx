import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const AttributFormModal = ({ open, handleClose, attribute, onSave }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && attribute) {
            setName(attribute.name); // Populate with existing attribute name
        }
    }, [attribute, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name };

        try {
            if (attribute) {
                // Update an existing attribute
                await axiosInstance.put(`/attributes/${attribute._id}`, payload);
            } else {
                // Create a new attribute
                await axiosInstance.post(`/attributes`, payload);
            }
            onSave(); // Refresh the attribute list
            handleClose(); // Close the modal
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Error saving attribute:', error);
            setError("Erreur lors de l'enregistrement de l'attribut."); // Set error message
        }
    };

    const handleModalClose = () => {
        handleClose();
        setName(''); // Clear form data on close
        setError(''); // Clear any error on close
    };

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
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
                <h2 id="modal-title">{attribute ? 'Modifier l\'attribut' : 'Ajouter un attribute'}</h2>
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

                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary">
                            Enregistrer
                        </Button>
                        <Button
                            onClick={handleModalClose}
                            variant="outlined"
                            color="secondary"
                        >
                            Annuler
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AttributFormModal;
