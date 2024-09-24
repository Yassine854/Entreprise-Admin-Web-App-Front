import React, { useRef } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import html2pdf from 'html2pdf.js';

const PrintOrder = ({ open, handleClose, order }) => {
    const factureRef = useRef();

    const downloadPdf = () => {
        if (!factureRef.current) return;

        const options = {
            margin: 1,
            filename: `facture_${order.serial_number}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(factureRef.current).set(options).save();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="print-order-title"
            aria-describedby="print-order-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 1200,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}
            >
                <Typography id="print-order-title" variant="h4" component="h2" gutterBottom>
                    Détails de la Facture
                </Typography>
                {order ? (
                    <>
                        <Box
                            ref={factureRef}
                            sx={{
                                maxWidth: 800,
                                margin: 'auto',
                                padding: 2,
                                border: '1px solid #eee',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
                                fontSize: '16px',
                                lineHeight: '24px',
                                fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
                                color: '#555',
                            }}
                        >
                            <h1>Facture</h1>
                            <table style={{ width: '100%', lineHeight: 'inherit', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <td className="title" style={{ fontSize: '45px', lineHeight: '45px', color: '#333' }}>
                                        {/* <img src={`https://example.shop/storage/img/profile/${product.image`} alt="Company logo" style={{ width: '100%', maxWidth: '300px' }} /> */}
                                    </td>

                                    <td style={{ textAlign: 'right' }}>
                                        Facture #: {order.serial_number}<br />
                                        Created: {new Date().toLocaleDateString()}<br />
                                        Due: {new Date().toLocaleDateString()}
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ paddingBottom: '40px' }}>
                                        Company Name<br />
                                        Address Line 1<br />
                                        Address Line 2
                                    </td>
                                    <td style={{ paddingBottom: '40px', textAlign: 'right' }}>
                                        {order.user.name}<br />
                                        {order.user.email}
                                    </td>
                                </tr>
                                <tr style={{ background: '#eee', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                                    <td>Item</td>
                                    <td>Price</td>
                                </tr>
                                {order.products.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td>{product.name}</td>
                                        <td>{product.price} DT</td>
                                    </tr>
                                ))}
                                <tr style={{ borderTop: '2px solid #eee', fontWeight: 'bold' }}>
                                    <td></td>
                                    <td>Total: {order.total_amount} DT</td>
                                </tr>
                            </table>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={downloadPdf}
                            startIcon={<PrintIcon />}
                            sx={{ mt: 3 }}
                            disabled={!order} // Disable button if no order
                        >
                            Télécharger PDF
                        </Button>
                    </>
                ) : (
                    <Typography variant="body1">Aucune Facture à imprimer.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default PrintOrder;
