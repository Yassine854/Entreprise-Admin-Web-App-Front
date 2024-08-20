import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Typography,
    Alert,
    Grid
} from '@mui/material';

const ParametreForm = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', key_word: '', temps_travail: '',
        email: '', url_fb: '', url_insta: '', url_youtube: '',
        url_tiktok: '', url_twiter: '', mode_payement: ''
    });
    const [parametre, setParametre] = useState(null);
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchParametre = async () => {
            if (!parametre) {
                try {
                    axios.defaults.withCredentials = true;
                    const resp = await axios.get(`https://example.shop/api/parametres/show/${user.id}`);
                    if (resp.status === 200) {
                        setParametre(resp.data.parametre);
                        setFormData(resp.data.parametre || {}); // Populate the form if parametre exists
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.log(error);
                    }
                }
            }
        };

        fetchParametre();
    }, [user.id, parametre]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            setAlertMessage("Utilisateur non valide.");
            setTimeout(() => setAlertMessage(''), 3000);
            return;
        }

        try {
            if (parametre) {
                // Update existing parametre
                axios.defaults.withCredentials = true;
                await axios.put(`https://example.shop/api/parametres/update/${parametre._id}`, formData);
                setAlertMessage("Paramètre mis à jour avec succès.");
            } else {
                // Create new parametre
                axios.defaults.withCredentials = true;
                const response = await axios.post(`https://example.shop/api/parametres/create/${user.id}`, formData);
                if (response.status === 201) {
                    setParametre(response.data.parametre); // Update state to switch to update mode
                    setAlertMessage("Paramètre créé avec succès.");
                } else {
                    throw new Error("Erreur lors de la création du paramètre.");
                }
            }
            setTimeout(() => setAlertMessage(''), 3000);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du paramètre", error.response);
            setAlertMessage("Erreur lors de l'enregistrement du paramètre.");
            setTimeout(() => setAlertMessage(''), 3000);
        }
    };

    return (
        <Card sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
            <CardContent>
                <Typography variant="h4" component="div" gutterBottom>
                    Gérer vos paramètres de site
                </Typography>
                {alertMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {alertMessage}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Titre"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={Boolean(errors.title)}
                                helperText={errors.title}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Mot Clé"
                                name="key_word"
                                value={formData.key_word || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={Boolean(errors.key_word)}
                                helperText={errors.key_word}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Temps de Travail"
                                name="temps_travail"
                                value={formData.temps_travail || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={Boolean(errors.temps_travail)}
                                helperText={errors.temps_travail}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="URL Facebook"
                                name="url_fb"
                                value={formData.url_fb || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="URL Instagram"
                                name="url_insta"
                                value={formData.url_insta || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="URL YouTube"
                                name="url_youtube"
                                value={formData.url_youtube || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="URL TikTok"
                                name="url_tiktok"
                                value={formData.url_tiktok || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="URL Twitter"
                                name="url_twiter"
                                value={formData.url_twiter || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Mode de Paiement"
                                name="mode_payement"
                                value={formData.mode_payement || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            >
                                <MenuItem value="">Sélectionnez un mode de paiement</MenuItem>
                                <MenuItem value="en ligne">En ligne</MenuItem>
                                <MenuItem value="à la livraison">À la livraison</MenuItem>
                                <MenuItem value="sans paiement">Sans paiement</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        {parametre ? 'Mettre à jour' : 'Créer'} Paramètre
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ParametreForm;
