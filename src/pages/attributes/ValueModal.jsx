import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const ValueFormModal = ({ open, handleClose, value, onSave, attributeId, setAlertMessage, setAlertSeverity }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && value) {
            setName(value.name); // Populate with existing value name
        }
    }, [value, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name };

        try {
            if (value) {
                // Update an existing value
                await axiosInstance.put(`/values/${value._id}`, payload);
                setAlertMessage('Valeur modifiée avec succès.');
                setAlertSeverity('success');
                setName('');
            } else {
                // Create a new value under the specific attribute
                await axiosInstance.post(`/values/${attributeId}`, payload);
                setAlertMessage('Valeur ajoutée avec succès.');
                setAlertSeverity('success');
                setName('');
            }
            onSave(); // Refresh the value list
            handleClose(); // Close the modal
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Error saving value:', error);
            setAlertMessage("Erreur lors de l'enregistrement de la valeur."); // Set error message
            setAlertSeverity('error');
        } finally {
            setTimeout(() => {
                setAlertMessage('');
            }, 3000);
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
                <h2 id="modal-title">{value ? 'Modifier la valeur' : 'Ajouter une valeur'}</h2>
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

export default ValueFormModal;
