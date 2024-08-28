import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Alert, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axiosInstance from '../../axiosInstance';
import ClientFormModal from './modal';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertType, setAlertType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const theme = useTheme();

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchClients = async () => {
        try {
            const response = await axiosInstance.get('/clients');
            setClients(response.data.clients);
            setFilteredClients(response.data.clients);
        } catch (error) {
            setError('Échec de la récupération des clients.');
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSearch = () => {
        const filtered = clients.filter(client =>
            client[searchCriteria].toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, searchCriteria, clients]);

    const handleBlock = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir bloquer ce client ?');
        if (confirmed) {
            try {
                await axiosInstance.put(`/admins/block/${id}`);
                fetchClients();
                setAlertMessage('Client bloqué avec succès.');
                setAlertSeverity('success');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            } catch (error) {
                setAlertMessage('Échec de blocage du client.');
                setAlertSeverity('error');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            }
        }
    };

    const handleUnBlock = async (id) => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir débloquer ce client ?');
        if (confirmed) {
            try {
                await axiosInstance.put(`/admins/unblock/${id}`);
                fetchClients();
                setAlertMessage('Client débloqué avec succès.');
                setAlertSeverity('success');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            } catch (error) {
                setAlertMessage('Échec de déblocage du client.');
                setAlertSeverity('error');
                setAlertType('delete');
                setTimeout(() => {
                    setAlertMessage('');
                    setAlertType('');
                }, 3000);
            }
        }
    };

    const openModalForEdit = (client) => {
        setSelectedClient(client);
        setModalOpen(true);
        setAlertType('');
    };

    const openModalForCreate = () => {
        setSelectedClient(null);
        setModalOpen(true);
        setAlertType('');
    };

    const handleSave = async () => {
        try {
            fetchClients();
            if (selectedClient) {
                setAlertMessage('Client modifié avec succès.');
                setAlertSeverity('success');
                setAlertType('edit');
            } else {
                setAlertMessage('Client ajouté avec succès.');
                setAlertSeverity('success');
                setAlertType('create');
            }
        } catch (error) {
            setAlertMessage('Échec de la mise à jour des clients.');
            setAlertSeverity('error');
            setAlertType(selectedClient ? 'edit' : 'create');
        } finally {
            setTimeout(() => {
                setAlertMessage('');
                setAlertType('');
                setModalOpen(false);
            }, 3000);
        }
    };

    const columns = [
        {
            name: 'Nom',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Ville',
            selector: row => row.city,
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
                        onClick={() => openModalForEdit(row)}
                        startIcon={<EditIcon />}
                    >
                        Modifier
                    </Button>
                    {row.blocked ? (
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleUnBlock(row._id)}
                            startIcon={<LockOpenIcon />}
                        >
                            Débloquer
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleBlock(row._id)}
                            startIcon={<LockIcon />}
                        >
                            Bloquer
                        </Button>
                    )}
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
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="city">Ville</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Recherche"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: '300px' }} // Medium width for the search input
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredClients}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />
            <ClientFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                client={selectedClient}
                onSave={handleSave}
            />
        </Container>
    );
};

export default ClientList;
