import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Alert, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import axiosInstance from '../../axiosInstance';
import FactureFormModal from './modal';
import PrintFactureModal from './print';  // Import the Print component

const FactureList = () => {
    const [factures, setFactures] = useState([]);
    const [filteredFactures, setFilteredFactures] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false); // State to control the print modal
    const [selectedFacture, setSelectedFacture] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('serial_number');
    const theme = useTheme();
    const user = JSON.parse(localStorage.getItem('user'));
    const [parametre, setParametre] = useState(null);

    // Fetch factures from the backend

    const fetchParametres = async () => {
        try {
            const response = await axiosInstance.get(`/parametres/show/${user.id}`);
            if (response.data && response.data.parametre) {
                setParametre(response.data.parametre);
            } else {
                setParametre(null);
            }
        } catch (error) {
            console.error('Error fetching parametres:', error);
        }
    };

    const fetchFactures = async () => {
        try {
            const response = await axiosInstance.get(`/factures/${user.id}`);
            if (response.data && response.data.length > 0) {
                setFactures(response.data);
                setFilteredFactures(response.data);
            } else {
                setFactures([]);
                setFilteredFactures([]);
            }
        } catch (error) {
            setError('Échec de la récupération des factures.');
            console.error('Error fetching factures:', error);
        }
    };

    useEffect(() => {
        fetchFactures();
        fetchParametres();
    }, []);

    // Search logic
    const handleSearch = () => {
        const filtered = factures.filter(facture => {
            switch (searchCriteria) {
                case 'serial_number':
                    return facture.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
                case 'commande_serial_number':
                    return facture.command.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
                case 'facture_date':
                    return facture.facture_date.includes(searchTerm);
                case 'user_name':
                    return facture.command.user.name.toLowerCase().includes(searchTerm.toLowerCase());
                default:
                    return false;
            }
        });
        setFilteredFactures(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, searchCriteria, factures]);

    // Open modals for editing, creating, or printing factures
    const openModalForEdit = (facture) => {
        setSelectedFacture(facture);
        setModalOpen(true);
    };

    const openModalForCreate = () => {
        setSelectedFacture(null);
        setModalOpen(true);
    };

    const openPrintModal = (facture) => {
        setSelectedFacture(facture);
        setPrintModalOpen(true);
    };

    const columns = [
        {
            name: 'ID Facture',
            selector: row => row.serial_number,
            sortable: true,
        },
        {
            name: 'Client',
            selector: row => row.command.user.name,
            sortable: true,
        },
        {
            name: 'Montant Total',
            selector: row => `${row.total_amount} Dt`,
            sortable: true,
        },
        {
            name: 'Date de la facture',
            selector: row => row.facture_date,
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
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => openPrintModal(row)}
                        startIcon={<PrintIcon />}
                    >
                        Imprimer
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
                        <MenuItem value="serial_number">ID Facture</MenuItem>
                        <MenuItem value="commande_serial_number">ID Commande</MenuItem>
                        <MenuItem value="facture_date">Date</MenuItem>
                        <MenuItem value="user_name">Nom du client</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Recherche"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 300 }}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredFactures}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />
            <FactureFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                facture={selectedFacture}
                onSave={fetchFactures}
            />
            <PrintFactureModal
                open={printModalOpen}
                handleClose={() => setPrintModalOpen(false)}
                facture={selectedFacture}
                parametre={parametre}  // Pass parametre here
            />
        </Container>
    );
};

export default FactureList;
