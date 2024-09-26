import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Stack, Typography, Grid, IconButton, Container, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../axiosInstance';
import SlideFormModal from './SlideModal'; // Ensure correct import path
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

const SliderAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sliders, setSliders] = useState([]);
    const [pending, setPending] = useState(true);
    const [selectedSlider, setSelectedSlider] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const fetchSliders = async () => {
        try {
            const response = await axiosInstance.get(`/sliders/${id}`);
            setSliders(response.data.sliders);
            setPending(false);
        } catch (error) {
            console.error('Failed to fetch sliders:', error);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, [id]);

    // Handle save operation with message
    const handleSave = (message) => {
        setAlertMessage(message);
        fetchSliders(); // Refresh sliders after saving

        // Set a timeout to hide the alert after 3 seconds
        setTimeout(() => {
            setAlertMessage('');
        }, 3000); // 3 seconds
    };

    const handleEdit = (slider) => {
        setSelectedSlider(slider);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette slide?');
        if (confirmed) {
            try {
                await axiosInstance.delete(`/sliders/delete/${id}`);
                fetchSliders();
                handleSave('Slide supprimé avec succès.');
            } catch (error) {
                console.error('Failed to delete slider:', error);
                handleSave('Erreur lors de la suppression du slide.');
            }
        }
    };

    const handleAdd = () => {
        setSelectedSlider(null);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedSlider(null);
    };

    const columns = [
        { name: 'Titre', selector: row => row.title, sortable: true },
        { name: 'Description', selector: row => row.description, sortable: true },
        { name: 'Image', selector: row => <img src={`https://example.shop/storage/img/sliders/${row.image}`} alt={row.title} style={{ width: '100px', height: 'auto' }} />, sortable: false },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => handleEdit(row)}
                        startIcon={<EditOutlined />}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row._id)}
                        startIcon={<DeleteOutlined />}
                    >
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Container sx={{ position: 'relative' }} maxWidth={false} disableGutters>
            <Stack spacing={6}>
                <IconButton
                    onClick={() => navigate(-1)} // Navigate to the previous page
                    sx={{
                        position: 'absolute',
                        top: 5,
                        color: 'text.primary',
                    }}
                >
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
                <Grid>
                    <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAdd}
                            startIcon={<AddIcon />}
                        >
                            Ajouter Slider
                        </Button>
                    </Grid>
                </Grid>
                {alertMessage && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
                <DataTable
                    title="Liste des Sliders"
                    columns={columns}
                    data={sliders}
                    pagination
                    progressPending={pending}
                    noDataComponent="Aucune slide trouvée"
                />
                <SlideFormModal
                    open={isModalOpen}
                    handleClose={handleClose}
                    slider={selectedSlider}
                    onSave={handleSave}
                    onAlert={(message) => {
                        setAlertMessage(message);
                        setAlertSeverity('success');
                    }}
                />
            </Stack>
        </Container>
    );
};

export default SliderAdmin;
