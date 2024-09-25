import React from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import html2pdf from 'html2pdf.js';

const PrintFactureModal = ({ open, handleClose, facture, parametre }) => {
    const downloadPdf = () => {
        const element = document.getElementById('facture-content');
        if (!element) return;

        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `facture_${facture.serial_number}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().from(element).set(options).save();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="print-facture-title"
            aria-describedby="print-facture-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 1500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '95vh', // Set maximum height for the modal
                    overflowY: 'auto',  // Enable vertical scrolling
                }}
            >
                <Typography id="print-facture-title" variant="h4" component="h2" gutterBottom align="center">
                    Détails de la Facture
                </Typography>
                {facture ? (
                    <>
                        <Box
                            id="facture-content"
                            sx={{
                                padding: 3,
                                border: '1px solid #ccc',
                                boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                                fontSize: '16px',
                                lineHeight: '24px',
                                fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
                                color: '#333',
                                backgroundColor: '#fff',
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        {parametre ? parametre.name : 'Nom de l’entreprise'}
                                    </Typography>
                                    {parametre?.email && (
                                        <Typography>Email: {parametre.email}</Typography>
                                    )}
                                    {parametre?.phone && (
                                        <Typography>Téléphone: {parametre.phone}</Typography>
                                    )}
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="h6">N°Facture : {facture.serial_number}</Typography>
                                    <Typography><strong>Date de création:</strong> {new Date(facture.facture_date).toLocaleDateString()}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            {/* Client Information */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Informations Client
                                    </Typography>
                                    {facture.command.user ? (
                                        <>
                                            <Typography><strong>Nom:</strong> {facture.command.user.name}</Typography>
                                            <Typography><strong>Email:</strong> {facture.command.user.email}</Typography>
                                            <Typography><strong>Téléphone:</strong> {facture.command.user.tel}</Typography>
                                            <Typography><strong>Adresse:</strong> {facture.command.user.address}, {facture.command.user.city}, {facture.command.user.zip}</Typography>
                                        </>
                                    ) : (
                                        <Typography>Aucune information client disponible.</Typography>
                                    )}
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            {/* Products Table */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Produits Commandés
                                </Typography>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                                            <th style={tableHeaderStyle}>Produit</th>
                                            <th style={tableHeaderStyle}>Attributs</th>
                                            <th style={tableHeaderStyle}>Quantité</th>
                                            <th style={tableHeaderStyle}>Prix (DT)</th>
                                            <th style={tableHeaderStyle}>Total (DT)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facture.command.products.map((product, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={tableCellStyle}>{product.product.name}</td>
                                                <td style={tableCellStyle}>
                                                    {product.attributes.map((attr, idx) => (
                                                        <div key={idx}>
                                                            <strong>{attr.attribute.name}:</strong> {attr.value.name}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td style={tableCellStyle}>{product.quantity}</td>
                                                <td style={tableCellStyle}>{product.product.price}</td>
                                                <td style={tableCellStyle}>{(product.product.price * product.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>

                            {/* Financial Summary */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography><strong>Total Commande:</strong> {facture.command.total_amount} DT</Typography>
                                <Typography><strong>TVA ({facture.facture_tva}%):</strong> {(facture.command.total_amount * (facture.facture_tva / 100)).toFixed(2)} DT</Typography>
                                <Typography variant="h6"><strong>Total Facture: {facture.total_amount} DT</strong></Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PrintIcon />}
                            onClick={downloadPdf}
                            sx={{ mt: 3 }}
                        >
                            Télécharger PDF
                        </Button>
                    </>
                ) : (
                    <Typography variant="h6" align="center">Aucune facture sélectionnée</Typography>
                )}
            </Box>
        </Modal>
    );
};

// Styles pour les tables
const tableHeaderStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
    fontWeight: 'bold',
};

const tableCellStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
};

export default PrintFactureModal;
