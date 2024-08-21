import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { TextField, Button, Grid, Typography, Alert,Box } from '@mui/material';

export default function PasswordUpdate() {
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        newPassword_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`admins/updatePassword/${user.id}`, formData);
            setAlertMessage('Mot de passe mis à jour avec succès.');
            setTimeout(() => {
                setAlertMessage('');
            }, 3000);
            setErrors({});
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <>
            {/* Flash message */}
            {alertMessage && (
                <Alert severity="success" style={{ marginBottom: '1rem' }}>
                {alertMessage}
                </Alert>
            )}

            <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Modifier le Mot de Passe
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mot de Passe Actuel"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword && errors.currentPassword[0]}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nouveau Mot de Passe"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword && errors.newPassword[0]}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirmer le Nouveau Mot de Passe"
                                name="newPassword_confirmation"
                                type="password"
                                value={formData.newPassword_confirmation}
                                onChange={handleChange}
                                error={!!errors.newPassword_confirmation}
                                helperText={errors.newPassword_confirmation && errors.newPassword_confirmation[0]}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4 }}
                    >
                        Mettre à jour
                    </Button>
                </form>
            </Box>
        </>
    );
}
