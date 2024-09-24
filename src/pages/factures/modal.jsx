import React, { useState, useEffect } from 'react';
import { Modal, Autocomplete, Button, TextField, Box, Alert, Grid, Typography } from '@mui/material';
import axiosInstance from '../../axiosInstance';

const FactureFormModal = ({ open, handleClose, facture, onSave }) => {
    const [serialNumber, setSerialNumber] = useState('');
    const [adminId, setAdminId] = useState('');
    const [commandes, setCommandes] = useState([]); // Store commandes
    const [commandeId, setCommandeId] = useState(null); // Set to null initially
    const [commandeNumber, setCommandeNumber] = useState(null); // Set to null initially
    const [factureDate, setFactureDate] = useState('');
    const [factureTva, setFactureTva] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [status, setStatus] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchCommandes = async () => {
        try {
            const response = await axiosInstance.get(`/commandes/${user.id}`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                setCommandes(response.data);
            } else {
                setCommandes([]);
            }
        } catch (error) {
            console.error('Error fetching commandes:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchCommandes();
            resetForm(); // Reset the form when the modal opens
        }
        if (facture) {
            setSerialNumber(facture.serial_number);
            setAdminId(facture.admin_id);
            // Find the correct command object based on the ID from the facture
            const matchingCommande = commandes.find(commande => commande._id === facture.commande_id);
            setCommandeId(matchingCommande || null); // Set the full object or null if not found
            setCommandeNumber(facture.command.serial_number || null);
            setFactureDate(facture.facture_date);
            setFactureTva(facture.facture_tva);
            setTotalAmount(facture.total_amount);
            setStatus(facture.status);
        }
    }, [facture, open]);

    useEffect(() => {
        if (commandeId && factureTva) {
            // Calculate the total amount based on the selected command and the TVA
            const commandeTotal = commandeId?.total_amount || 0;
            const tvaPercentage = parseFloat(factureTva) / 100;
            const totalWithTva = commandeTotal + (commandeTotal * tvaPercentage);
            setTotalAmount(totalWithTva.toFixed(2)); // Round to two decimal places
        }
    }, [commandeId, factureTva]);

    const resetForm = () => {
        setSerialNumber('');
        setAdminId('');
        setCommandeId(null); // Reset to null
        setFactureDate('');
        setFactureTva('');
        setTotalAmount('');
        setStatus('');
        setFieldErrors({}); // Reset field errors
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            admin_id: user.id,
            commande_id: commandeId?._id, // Use _id from the selected commande
            facture_date: factureDate,
            facture_tva: factureTva,
            total_amount: totalAmount,
        };

        try {
            if (facture) {
                await axiosInstance.put(`/factures/${facture._id}`, payload);
            } else {
                console.log(payload);
                await axiosInstance.post('/factures', payload);
            }
            onSave();
            handleClose();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setFieldErrors(error.response.data.errors);
            } else {
                console.log(error);
                setFieldErrors({ general: 'Une erreur est survenue, veuillez réessayer.' });
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                handleClose();
                resetForm();
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '90%', lg: '80%' },
                    maxWidth: 1400,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}
            >
                <h2 id="modal-title">{facture ? 'Modifier Facture' : 'Ajouter Facture'}</h2>
                {fieldErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{fieldErrors.general}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Autocomplete
                                value={commandeId}
                                onChange={(event, newValue) => setCommandeId(newValue)} // Set to newValue directly
                                options={commandes}
                                getOptionLabel={(option) => option.serial_number || ''}
                                isOptionEqualToValue={(option, value) => option._id === value?._id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Commandes"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                                noOptionsText="Aucune commande trouvée"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type="date"
                                value={factureDate}
                                onChange={(e) => setFactureDate(e.target.value)}
                                error={!!fieldErrors.facture_date}
                                helperText={fieldErrors.facture_date ? fieldErrors.facture_date.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="TVA Facture (%)"
                                variant="outlined"
                                type="number"
                                value={factureTva}
                                onChange={(e) => setFactureTva(e.target.value)}
                                error={!!fieldErrors.facture_tva}
                                helperText={fieldErrors.facture_tva ? fieldErrors.facture_tva.join(' ') : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Montant total : {totalAmount} TND
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {facture ? 'Modifier' : 'Ajouter'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default FactureFormModal;
