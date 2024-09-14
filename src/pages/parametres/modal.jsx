import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert, Grid } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const SlideFormModal = ({ open, onClose, slide, onSave, defaultCategoryId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (slide) {
            setTitle(slide.title || '');
            setDescription(slide.description || '');
            setImage(null);
        } else {
            resetForm();
        }
    }, [slide, open]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setImage(null);
        setFieldErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            if (slide) {
                await axiosInstance.post(`/sliders/update/${slide._id}`, formData);
                onSave('Slide modifié avec succès.');
            } else {
                await axiosInstance.post(`/sliders/create/${user.id}`, formData);
                onSave('Slide créé avec succès.');
            }
            resetForm();  // Reset form after successful submission
            onClose();  // Close modal after save
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setFieldErrors(error.response.data.errors || {});
            } else {
                onSave('Erreur lors de la soumission du formulaire.');
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                resetForm();  // Clear form and errors on close
                onClose();  // Close the modal
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
                    width: '90%',
                    maxWidth: 800,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    overflow: 'auto',
                }}
            >
                <h2 id="modal-title">{slide ? 'Modifier Slide' : 'Ajouter Slide'}</h2>
                {fieldErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{fieldErrors.general}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
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
                                label="Description"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={!!fieldErrors.description}
                                helperText={fieldErrors.description ? fieldErrors.description.join(' ') : ''}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="file"
                                variant="outlined"
                                onChange={(e) => setImage(e.target.files[0])}
                                error={!!fieldErrors.image}
                                helperText={fieldErrors.image ? fieldErrors.image.join(' ') : ''}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        fullWidth
                    >
                        {slide ? 'Modifier' : 'Ajouter'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default SlideFormModal;
