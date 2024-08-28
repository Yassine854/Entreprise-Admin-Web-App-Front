import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Alert, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../axiosInstance';
import OrderFormModal from './modal';
import PrintOrder from './print';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('serial_number');
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const theme = useTheme();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user?.id) {
            fetchOrders();
        }
    }, [user?.id]);

    useEffect(() => {
        handleSearch();
    }, [searchTerm, searchCriteria, orders]);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get(`/commandes/${user.id}`);
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            setError('Failed to fetch orders.');
            setAlertMessage('Failed to fetch orders.');
            setAlertSeverity('error');
            console.error('Error fetching orders:', error);
        }
    };

    const handleSearch = () => {
        const filtered = orders.filter(order => {
            const term = searchTerm.toLowerCase();
            switch (searchCriteria) {
                case 'serial_number':
                    return order.serial_number.toLowerCase().includes(term);
                case 'client':
                    return order.user.name.toLowerCase().includes(term);
                case 'status':
                    return order.status.toLowerCase().includes(term);
                default:
                    return false;
            }
        });
        setFilteredOrders(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
            try {
                await axiosInstance.delete(`/commandes/${id}`);
                setOrders(orders.filter(order => order._id !== id));
                showAlert('Commande supprimée avec succés.');
            } catch (error) {
                setError('Failed to delete order.');
                setAlertMessage('Failed to delete order.');
                setAlertSeverity('error');
                console.error('Error deleting order:', error);
            }
        }
    };

    const openModalForEdit = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const openModalForCreate = () => {
        setSelectedOrder(null);
        setModalOpen(true);
    };

    const handleSave = async () => {
        await fetchOrders();
        setModalOpen(false);
        showAlert(selectedOrder ? 'Commande modifiée avec succés.' : 'Commande ajoutée avec succés.', 'success');
    };

    const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setTimeout(() => setAlertMessage(''), 3000); // Clear alert after 3 seconds
    };

    const handlePrint = async (orderId) => {
        try {

            const response = await axiosInstance.get(`/ShowCommande/${orderId}`);
            setSelectedOrder(response.data);
            setPrintModalOpen(true);
        } catch (error) {
            console.error('Error fetching order details for print:', error);
        }
    };


    const columns = [
        {
            name: 'ID Commande',
            selector: row => row.serial_number,
            sortable: true,
        },
        {
            name: 'Client',
            selector: row => row.user.name,
            sortable: true,
        },
        {
            name: 'Montant total',
            selector: row => `${row.total_amount.toFixed(2)} DT`,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
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
                        color="error"
                        onClick={() => handleDelete(row._id)}
                        startIcon={<DeleteIcon />}
                    >
                        Supprimer
                    </Button>
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={() => handlePrint(row._id)}
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
            <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={openModalForCreate}
                    startIcon={<AddIcon />}
                    sx={{ mb: 2 }}
                >
                    Ajouter
                </Button>
                <Box display="flex" alignItems="center" mb={2} gap={1}>
                    <FormControl sx={{ minWidth: 120, mr: 1 }}>
                        <InputLabel>Critère</InputLabel>
                        <Select
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                            label="Critère"
                        >
                            <MenuItem value="serial_number">ID Commande</MenuItem>
                            <MenuItem value="client">Client</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        label="Rechercher"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        sx={{ width: '300px' }}
                        InputProps={{
                            endAdornment: (
                                <SearchIcon />
                            ),
                        }}
                    />
                </Box>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <DataTable
                columns={columns}
                data={filteredOrders}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />
            <OrderFormModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                order={selectedOrder}
                onSave={handleSave}
            />
            <PrintOrder
        open={printModalOpen}
        handleClose={() => setPrintModalOpen(false)}
        order={selectedOrder}
    />
        </Container>
    );
};

export default OrderList;
