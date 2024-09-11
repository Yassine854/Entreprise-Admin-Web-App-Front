import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Grid, Typography, Container, Alert, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List'; // Import ListIcon for "Valeurs"
import axiosInstance from '../../axiosInstance';
import AttributeFormModal from './AttributeModal';
import { useNavigate } from 'react-router-dom';


const AttributeList = () => {
    const [attributes, setAttributes] = useState([]);
    const [filteredAttributes, setFilteredAttributes] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const theme = useTheme();
    const navigate = useNavigate();

    // Fetch user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch attributes on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const attributesResponse = await axiosInstance.get('/attributes');
                setAttributes(attributesResponse.data);
            } catch (error) {
                setError('Échec de la récupération des attributs.');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Filter attributes based on search term
    useEffect(() => {
        const handleSearch = () => {
            const filtered = attributes.filter(attribute =>
                attribute[searchCriteria]?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAttributes(filtered);
        };

        handleSearch();
    }, [searchTerm, searchCriteria, attributes]);

    // Handle delete action
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet attribut ?');
        if (confirmed) {
            try {
                await axiosInstance.delete(`/attributes/${id}`);
                setAttributes(attributes.filter(attribute => attribute._id !== id));
                setAlertMessage('Attribut supprimé avec succès.');
                setAlertSeverity('success');
            } catch (error) {
                setAlertMessage('Échec de la suppression de l\'attribut.');
                setAlertSeverity('error');
            } finally {
                setTimeout(() => {
                    setAlertMessage('');
                }, 3000);
            }
        }
    };

    // Open modal for editing an attribute
    const openModalForEdit = (attribute) => {
        setSelectedAttribute(attribute);
        setModalOpen(true);
    };

    const openValueComponent = (attribute) => {
        navigate(`/attributes/${attribute._id}`, {
            state: { attributeName: attribute.name } // Passing the attribute name
        });
    };


    // Open modal for creating a new attribute
    const openModalForCreate = () => {
        setSelectedAttribute(null);
        setModalOpen(true);
    };

    // Handle save action (for create or edit)
    const handleSave = async () => {
        try {
            const response = await axiosInstance.get('/attributes');
            setAttributes(response.data);

            setAlertMessage(selectedAttribute ? 'Attribut modifié avec succès.' : 'Attribut ajouté avec succès.');
            setAlertSeverity('success');
        } catch (error) {
            setAlertMessage('Échec de la mise à jour des attributs.');
            setAlertSeverity('error');
        } finally {
            setTimeout(() => {
                setAlertMessage('');
                setModalOpen(false);
            }, 3000);
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
            name: 'Total valeurs',
            selector: row => row.values.length,
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
                        onClick={() => openValueComponent(row)}
                        startIcon={<ListIcon />} // Use ListIcon for "Valeurs"
                    >
                        Valeurs
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => openModalForEdit(row)}
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

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={openModalForCreate}
                startIcon={<AddIcon />}
            >
                Ajouter
            </Button>

            {error && <p>{error}</p>}

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                    <InputLabel>Critère</InputLabel>
                    <Select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        label="Critère"
                    >
                        <MenuItem value="name">Nom</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Rechercher"
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
                data={filteredAttributes}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />

            <AttributeFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                attribute={selectedAttribute}
                onSave={handleSave}
            />
        </Container>
    );
};

export default AttributeList;
