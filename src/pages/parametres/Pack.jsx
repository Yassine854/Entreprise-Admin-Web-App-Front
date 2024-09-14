import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import {
    Grid, Card, CardContent, Typography, CircularProgress, Box, IconButton, Modal, Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    borderRadius: '16px',
    boxShadow: theme.shadows[3],
    ':hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[10],
    },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(4),
}));

export default function PackSelection() {
    const [packs, setPacks] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [packToSelect, setPackToSelect] = useState(null); // Track which pack is being selected

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const response = await axiosInstance.get('/packs');
                if (Array.isArray(response.data)) {
                    setPacks(response.data);
                    setSelectedPack(user.pack_id); // Set the initial selected pack from local storage
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                setError('Failed to load packs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPacks();
    }, [user.pack_id]);

    const handleSelectPack = (pack) => {
        // If the user has already selected this pack, navigate directly to the pack details
        if (selectedPack === pack._id) {
            navigate(`/packs/${pack._id}`);
        } else {
            // Otherwise, open the confirmation modal
            setPackToSelect(pack);
            setOpenModal(true);
        }
    };

    const confirmSelection = async () => {
        try {
            const response = await axiosInstance.post(`/updatePack/${user.id}/${packToSelect._id}`);
            if (response.status === 200) {
                const updatedUser = { ...user, pack_id: packToSelect._id };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                setSelectedPack(packToSelect._id);
                setOpenModal(false);

                // Navigate to the pack details after selection
                navigate(`/packs/${packToSelect._id}`);
            }
        } catch (err) {
            console.error('Error updating pack:', err);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
<Box p={4} minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="background.default" sx={{ position: 'relative' }}>

            <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                Choisissez un Pack
            </Typography>
            <IconButton
                onClick={() => navigate(-1)} // Navigate to the previous page
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    color: 'text.primary',
                }}
            >
                <ArrowBackIcon fontSize="large" />
            </IconButton>

            <Grid container spacing={3} justifyContent="center" maxWidth={1200}>
                {packs.map((pack) => (
                    <Grid item xs={12} sm={6} md={4} key={pack._id}>
                        <StyledCard
                            onClick={() => handleSelectPack(pack)}
                            sx={{
                                borderColor: selectedPack === pack._id ? 'primary.main' : 'divider',
                                borderWidth: 2,
                                borderStyle: 'solid',
                            }}
                        >
                            <StyledCardContent>
                                <Typography variant="h4" color="textPrimary" gutterBottom>
                                    {pack.title}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" mb={2}>
                                    {pack.description}
                                </Typography>
                                <Typography variant="h5" color="textPrimary" mb={2}>
                                    {pack.prix} DT
                                </Typography>
                                {pack.image && (
                                    <Box
                                        component="img"
                                        src={pack.image}
                                        alt={pack.title}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            mb: 2,
                                        }}
                                    />
                                )}
                                {selectedPack === pack._id && (
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            color: 'success.main',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            padding: '8px',
                                        }}
                                    >
                                        <CheckCircleOutlineIcon fontSize="large" />
                                    </IconButton>
                                )}
                            </StyledCardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* Modal for confirmation */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center'
                }}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Confirmer la sélection
                    </Typography>
                    <Typography id="modal-description" sx={{ mb: 2 }}>
                        Êtes-vous sûr de vouloir sélectionner le pack "{packToSelect?.title}" ?
                    </Typography>
                    <Button variant="contained" color="primary" onClick={confirmSelection}>
                        Oui, sélectionnez-le
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ ml: 2 }}>
                        Annuler
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
