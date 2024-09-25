import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import {
    Card,
    Container,
    IconButton,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Typography,
    Alert,
    Grid,
    Autocomplete,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';

const ParametreForm = () => {
    const [formData, setFormData] = useState({
        title: '', name: '', address: '', phone: '',description: '', key_word: '', temps_travail: '',
        email: '', url_fb: '', url_insta: '', url_youtube: '',
        url_tiktok: '', url_twiter: '', mode_payement: '', nature_id: ''
    });
    const [parametre, setParametre] = useState(null);
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [natures, setNatures] = useState([]);
    const [openAddNature, setOpenAddNature] = useState(false);
    const [newNature, setNewNature] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    // Fetch natures
    useEffect(() => {
        const fetchNatures = async () => {
            try {
                const response = await axiosInstance.get('/natures');
                setNatures(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des natures:', error);
            }
        };
        fetchNatures();
    }, []);

    // Fetch parameters
    useEffect(() => {
        const fetchParametre = async () => {
            if (!parametre) {
                try {
                    const resp = await axiosInstance.get(`/parametres/show/${user.id}`);
                    if (resp.status === 200) {
                        setParametre(resp.data.parametre);
                        setFormData(resp.data.parametre || {});
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

    const handleNatureChange = (event, value) => {
        setFormData(prevData => ({ ...prevData, nature_id: value ? value._id : '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        // Check if nature is selected
        if (!formData.name) {
            validationErrors.name = "Le nom  d'entrprise est obligatoir.";
        }

        if (!formData.phone) {
            validationErrors.phone = "Le Numéro de téléphone est obligatoir.";
        }

        if (!formData.address) {
            validationErrors.address = "L'adresse est obligatoir.";
        }

        if (!formData.nature_id) {
            validationErrors.nature = 'La nature est obligatoire.';
        }

        // Other validations...

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (parametre) {
                await axiosInstance.put(`/parametres/update/${parametre._id}`, formData);
                setAlertMessage("Paramètre mis à jour avec succès.");
            } else {
                const response = await axiosInstance.post(`/parametres/create/${user.id}`, formData);
                if (response.status === 201) {
                    setParametre(response.data.parametre);
                    setAlertMessage("Paramètre créé avec succès.");
                } else {
                    throw new Error("Erreur lors de la création du paramètre.");
                }
            }
            setTimeout(() => setAlertMessage(''), 3000);
            setErrors('');
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du paramètre", error.response);
            setFieldErrors(error.response.data);
        }
    };

    const handleOpenAddNature = () => {
        setOpenAddNature(true);
    };

    const handleCloseAddNature = () => {
        setFieldErrors('');
        setOpenAddNature(false);
    };

    const handleAddNature = async () => {
        try {
            const response = await axiosInstance.post('/natures', { name: newNature });
            if (response.status === 201) {
                setNatures([...natures, response.data]);
                setNewNature('');
                setOpenAddNature(false);
                setAlertMessage("Nature Ajoutée avec succès.");
                setTimeout(() => setAlertMessage(''), 3000);
                setFieldErrors('');
                setErrors('');

            }
        } catch (error) {
            if (error.response.status === 422) {
                setFieldErrors(error.response.data);
            }
        }
    };

    return (

<Container sx={{ position: 'relative' }} maxWidth={false}>
<Card>
            <CardContent>
            <Stack
            sx={{ position: 'relative', p: 2 }}
            spacing={2} // Adds spacing between stacked items
            alignItems="flex-start" // Align items to the start
        >
            <IconButton
                onClick={() => navigate(-1)}
                sx={{
                    color: 'text.primary',
                }}
            >
                <ArrowBackIcon fontSize="large" />
            </IconButton>
            <Typography variant="h4" component="div" gutterBottom>
                Gérer vos paramètres de site
            </Typography>
        </Stack>
                {alertMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {alertMessage}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
    <Grid container spacing={3}>
        {/* Nature field with error display */}
        <Grid item xs={12} sm={6}>
            <Autocomplete
                options={natures}
                getOptionLabel={(option) => option.name}
                value={natures.find(nature => nature._id === formData.nature_id) || null}
                onChange={handleNatureChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Nature"
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.nature)}
                        helperText={errors.nature}
                    />
                )}
            />
            <Button onClick={handleOpenAddNature} sx={{ mt: 2 }}>Ajouter une nouvelle nature</Button>
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                label="Nom d'entreprise"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.name)}
                helperText={errors.name}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Adresse"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.address)}
                                    helperText={errors.address}
                                />
                            </Grid>

                            {/* Phone field */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Téléphone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone}
                                />
                            </Grid>
        {/* Description field */}
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

        {/* Mot Clé and Temps de Travail fields */}
        <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
            </Grid>
        </Grid>

        {/* Other form fields */}
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
        {/* Other URL fields */}
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
        {parametre ? 'Modifier' : 'Créer'} Paramètres
    </Button>
</form>

            </CardContent>

            {/* Add New Nature Dialog */}
            <Dialog
                open={openAddNature}
                onClose={handleCloseAddNature}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Ajouter une nouvelle nature</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nom de la nature"
                        value={newNature}
                        onChange={(e) => setNewNature(e.target.value)}
                        fullWidth
                        variant="outlined"
                        error={!!fieldErrors.name}
                        helperText={fieldErrors.name ? fieldErrors.name.join(' ') : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddNature}>Annuler</Button>
                    <Button onClick={handleAddNature} variant="contained" color="primary">
                        Ajouter
                    </Button>
                </DialogActions>
            </Dialog>
            </Card>
        </Container>
    );
};

export default ParametreForm;
