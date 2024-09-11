import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Grid, Typography, Container, Alert, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../axiosInstance';
import { useParams, useLocation } from 'react-router-dom';
import ValueFormModal from './ValueModal'; // Import the modal component

const Values = () => {
    const { id } = useParams(); // Get the attribute_id from URL
    const location = useLocation(); // Get the location object
    const attributeName = location.state?.attributeName || 'Attribut'; // Retrieve the attribute name or fallback
    const [values, setValues] = useState([]);
    const [filteredValues, setFilteredValues] = useState([]); // To store the filtered data
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    // Fetch values for the given attribute on component mount
    useEffect(() => {
        const fetchValues = async () => {
            try {
                const response = await axiosInstance.get(`/values/${id}`);
                setValues(response.data);
                setFilteredValues(response.data); // Initialize filtered values with the complete data
            } catch (error) {
                setError('Échec de la récupération des valeurs.');
                console.error(error);
            }
        };

        fetchValues();
    }, [id]);

    // Filter values based on the search term
    useEffect(() => {
        const filtered = values.filter(value =>
            value.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredValues(filtered);
    }, [searchTerm, values]);

    // Handle delete action
    const handleDelete = async (valueId) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette valeur ?');
        if (confirmed) {
            try {
                await axiosInstance.delete(`/values/${valueId}`);
                setValues(values.filter(value => value._id !== valueId));
                setAlertMessage('Valeur supprimée avec succès.');
                setAlertSeverity('success');
            } catch (error) {
                setAlertMessage('Échec de la suppression de la valeur.');
                setAlertSeverity('error');
            } finally {
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
        }
    };

    const handleOpenModal = (value = null) => {
        setSelectedValue(value);
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.get(`/values/${id}`);
            setValues(response.data);
        } catch (error) {
            setError('Échec de la récupération des valeurs.');
            console.error(error);
        }
    };

    // Table columns definition
    const columns = [
        {
            name: 'Nom',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenModal(row)}
                        startIcon={<EditIcon />}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row._id)}
                        startIcon={<DeleteIcon />}
                    >
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Container maxWidth={false} disableGutters>
            {alertMessage && (
                <Alert severity={alertSeverity} style={{ marginBottom: '1rem' }}>
                    {alertMessage}
                </Alert>
            )}

            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                    {`Attribut: ${attributeName}`}
                </Typography>
            </Grid>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => handleOpenModal()}
                startIcon={<AddIcon />}
            >
                Ajouter Valeur
            </Button>

            {error && <p>{error}</p>}

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <TextField
                    label="Rechercher par nom"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: '300px' }} // Medium width for the search input
                    InputProps={{
                        endAdornment: <SearchIcon />,
                    }}
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredValues} // Use filtered values for rendering the table
                pagination
                highlightOnHover
                pointerOnHover
            />

            <ValueFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                value={selectedValue}
                onSave={handleSave}
                attributeId={id} // Pass the attribute ID to the modal
                setAlertMessage={setAlertMessage} // Pass alert setter function
                setAlertSeverity={setAlertSeverity} // Pass alert severity setter function
            />
        </Container>
    );
};

export default Values;
