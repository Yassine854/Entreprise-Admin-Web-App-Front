import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Box, Alert, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const tunisianCities = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia', 'Kairouan', 'Sfax',
    'Gabès', 'Mednine', 'Tataouine', 'Kasserine', 'Jendouba', 'Siliana', 'Zaghouan', 'Bizerte', 'Beja', 'Kebili',
    'Gafsa', 'Sidi Bouzid', 'Médénine', 'Tozeur', 'Kef'
];

const ClientFormModal = ({ open, handleClose, client, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (client) {
            setName(client.name);
            setEmail(client.email);
            setTel(client.tel);
            setCity(client.city);
            setAddress(client.address);
            setZip(client.zip);
            setPassword('');
        } else {
            setName('');
            setEmail('');
            setTel('');
            setCity('');
            setAddress('');
            setZip('');
            setPassword('');
        }
    }, [client, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name, email, tel, city, address, zip, password, user_id: user.id };

        try {
            if (client) {
                await axiosInstance.put(`/clients/update/${client._id}`, payload);
            } else {
                await axiosInstance.post('/CreateClient', payload);
            }
            onSave();
            handleClose();
        } catch (error) {
            if (error.response.status === 422) {
                setFieldErrors(error.response.data.errors);
            } else {
                setFieldErrors({ general: 'Une erreur est survenue, veuillez réessayer.' });
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                handleClose();
                setName('');
                setEmail('');
                setTel('');
                setCity('');
                setAddress('');
                setZip('');
                setPassword('');
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
                    width: { xs: '90%', sm: '80%', md: '90%', lg: '80%' }, // Wider width
                    maxWidth: 1400, // Increased max-width for an even larger modal
                    maxHeight: '90vh', // Increased max height to allow more content
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto', // Enable vertical scrolling
                }}
            >
                <h2 id="modal-title">{client ? 'Modifier le client' : 'Ajouter un client'}</h2>
                {fieldErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{fieldErrors.general}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}> {/* Increased spacing for better layout */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Nom"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name ? fieldErrors.name.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!fieldErrors.email}
                                helperText={fieldErrors.email ? fieldErrors.email.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Téléphone"
                                variant="outlined"
                                type="tel"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                error={!!fieldErrors.tel}
                                helperText={fieldErrors.tel ? fieldErrors.tel.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal" variant="outlined" error={!!fieldErrors.city}>
                                <InputLabel>Ville</InputLabel>
                                <Select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    label="Ville"
                                >
                                    {tunisianCities.map(city => (
                                        <MenuItem key={city} value={city}>{city}</MenuItem>
                                    ))}
                                </Select>
                                {fieldErrors.city && <FormHelperText>{fieldErrors.city.join(' ')}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Adresse"
                                variant="outlined"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={!!fieldErrors.address}
                                helperText={fieldErrors.address ? fieldErrors.address.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Code postal"
                                variant="outlined"
                                type="number"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                error={!!fieldErrors.zip}
                                helperText={fieldErrors.zip ? fieldErrors.zip.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Mot de passe"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!fieldErrors.password}
                                helperText={fieldErrors.password ? fieldErrors.password.join(' ') : ''}
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
                        {client ? 'Modifier' : 'Ajouter'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default ClientFormModal;
