import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert, Grid } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const SliderFormModal = ({ open, handleClose, slider, onSave, onAlert }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (open) {
            resetForm(); // Réinitialiser le formulaire lorsque le modal s'ouvre
            if (slider) {
                setTitle(slider.title);
                setDescription(slider.description);
                setImage(null); // Réinitialiser l'image
            }
        }
    }, [slider, open]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setImage(null);
        setFieldErrors({});
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]); // Récupérer le fichier sélectionné
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
            formData.append('image', image); // Ajouter l'image au FormData
        }

        try {
            if (slider) {
                await axiosInstance.post(`/sliders/update/${slider._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onAlert('Slider mis à jour avec succès.'); // Message d'alerte pour mise à jour
            } else {
                await axiosInstance.post(`/sliders/create/${user.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onAlert('Slide créée avec succès.'); // Message d'alerte pour création
            }
            onSave(); // Appeler la fonction onSave pour rafraîchir la liste
            handleClose(); // Fermer le modal
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setFieldErrors(error.response.data.errors); // Gérer les erreurs de validation
            } else {
                console.log(error);
                setFieldErrors({ general: 'Une erreur est survenue, veuillez réessayer.' });
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                resetForm(); // Réinitialiser le formulaire avant de fermer
                handleClose(); // Fermer le modal
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
                    width: { xs: '90%', sm: '80%', md: '90%', lg: '80%' },
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2 id="modal-title">{slider ? 'Modifier Slider' : 'Ajouter Slider'}</h2>
                {fieldErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{fieldErrors.general}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Titre"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                error={!!fieldErrors.title}
                                helperText={fieldErrors.title ? fieldErrors.title.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={!!fieldErrors.description}
                                helperText={fieldErrors.description ? fieldErrors.description.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="file"
                                onChange={handleImageChange}
                                error={!!fieldErrors.image}
                                helperText={fieldErrors.image || ''}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {slider ? 'Modifier' : 'Ajouter'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default SliderFormModal;
