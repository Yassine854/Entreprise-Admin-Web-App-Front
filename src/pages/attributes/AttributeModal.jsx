import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const AttributFormModal = ({ open, handleClose, attribute, onSave }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({}); // État pour les erreurs de validation

    useEffect(() => {
        if (open && attribute) {
            setName(attribute.name); // Remplir avec le nom de l'attribut existant
        }
        // Réinitialiser les erreurs lorsque le modal s'ouvre
        setErrors({});
        setError('');
    }, [attribute, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name };

        try {
            if (attribute) {
                // Mettre à jour un attribut existant
                await axiosInstance.put(`/attributes/${attribute._id}`, payload);
            } else {
                // Créer un nouvel attribut
                await axiosInstance.post(`/attributes`, payload);
            }
            onSave(); // Rafraîchir la liste des attributs
            handleClose(); // Fermer le modal
            setError(''); // Effacer toute erreur précédente
        } catch (error) {
            console.error('Error saving attribute:', error);
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); // Mettre à jour l'état des erreurs
            } else {
                setError("Erreur lors de l'enregistrement de l'attribut."); // Message d'erreur générique
            }
        }
    };

    const handleModalClose = () => {
        handleClose();
        setName(''); // Effacer les données du formulaire à la fermeture
        setError(''); // Effacer toute erreur à la fermeture
        setErrors({}); // Réinitialiser les erreurs
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
                <h2 id="modal-title">{attribute ? 'Modifier l\'attribut' : 'Ajouter un attribut'}</h2>
                {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nom"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name} // Vérifiez s'il y a une erreur pour ce champ
                        helperText={errors.name ? errors.name.join(', ') : ''} // Affichez les messages d'erreur
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
