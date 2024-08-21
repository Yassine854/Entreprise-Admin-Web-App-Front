import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';
import { Grid, Card, CardContent, Typography, CircularProgress, Box, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Material-UI icon
import { styled } from '@mui/material/styles';

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

export default function OffreSelection() {
    const [offres, setOffres] = useState([]);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch offres from the Laravel API
        const fetchOffres = async () => {
            try {
                const response = await axiosInstance.get('/offres');
                if (Array.isArray(response.data)) {
                    setOffres(response.data);
                    setSelectedOffre(user.offre_id); // Set the initial selected offre from local storage
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                setError('Failed to load offres');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffres();
    }, [user.offre_id]); // Depend on user.offre_id to refresh when it changes

    const updateOffre = async (offre) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, sélectionnez-le !',
        });

        if (result.isConfirmed) {
            try {
                // Assuming you have an endpoint to handle the selection/update
                const response = await axiosInstance.post(`updateOffre/${user.id}/${offre._id}`);
                if (response.status === 200) {
                    // Update the local storage
                    const updatedUser = { ...user, offre_id: offre._id };
                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    // Update state to reflect the selection
                    setSelectedOffre(offre._id);
                }
            } catch (err) {
                Swal.fire(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                );
                console.error(err);
            }
        }
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
        <Box p={4} minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="background.default">
            <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                Choisissez un Offre
            </Typography>

            <Grid container spacing={3} justifyContent="center" maxWidth={1200}>
                {offres.map((offre) => (
                    <Grid item xs={12} sm={6} md={4} key={offre._id}>
                        <StyledCard
                            onClick={() => updateOffre(offre)}
                            sx={{
                                borderColor: selectedOffre === offre._id ? 'primary.main' : 'divider',
                                borderWidth: 2,
                                borderStyle: 'solid',
                            }}
                        >
                            <StyledCardContent>
                                <Typography variant="h4" color="textPrimary" gutterBottom>
                                    {offre.title}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" mb={2}>
                                    {offre.description}
                                </Typography>
                                <Typography variant="h5" color="textPrimary" mb={2}>
                                    {offre.prix} DT
                                </Typography>
                                {/* Display an image if available */}
                                {offre.image && (
                                    <Box
                                        component="img"
                                        src={offre.image}
                                        alt={offre.title}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            mb: 2,
                                        }}
                                    />
                                )}
                                {selectedOffre === offre._id && (
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
        </Box>
    );
}
