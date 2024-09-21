import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const CategoryFormModal = ({ open, handleClose, category, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({}); // État pour les erreurs
    const user = JSON.parse(localStorage.getItem('user'));
    const [parametre, setParametre] = useState([]);

    const fetchParametre = async () => {
        try {
            const resp = await axiosInstance.get(`/parametres/show/${user.id}`);
            if (resp.status === 200) {
                setParametre(resp.data.parametre);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchParametre();

        if (category) {
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }

        // Réinitialiser les erreurs lorsque le modal s'ouvre
        setErrors({});
        setError('');
    }, [category, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name, description, user_id: user.id };

        try {
            if (category) {
                await axiosInstance.put(`/categories/${category._id}`, payload);
            } else {
                await axiosInstance.post(`/categories/${parametre.nature_id}`, payload);
            }
            onSave(); // Rafraîchir la liste des catégories
            handleClose(); // Fermer le modal
        } catch (error) {
            console.error('Error saving category:', error);
            if (error.response && error.response.data) {
                setErrors(error.response.data); // Mettre à jour l'état des erreurs
            } else {
                setError('Erreur lors de l\'enregistrement de la catégorie.'); // Set error message
            }
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
                        error={!!errors.name}
                        helperText={errors.name ? errors.name.join(', ') : ''} // Afficher les messages d'erreur
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description} // Vérifiez si une erreur existe pour ce champ
                        helperText={errors.description ? errors.description.join(', ') : ''} // Afficher les messages d'erreur
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
