import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import DynamicBarChart from './DynamicBarChart';
import {
    Avatar,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Stack,
    Typography,
    CircularProgress,
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
    const navigate = useNavigate();

    const [commandes, setCommandes] = useState(null);
    const [clients, setClients] = useState(null);
    const [factures, setFactures] = useState(null);
    const [recentCommandes, setRecentCommandes] = useState([]);
    const [usersByCity, setUsersByCity] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const response = await axiosInstance.get(`/NbCommandes/${user.id}`);
                setCommandes(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
            }
        };

        const fetchFactures = async () => {
            try {
                const response = await axiosInstance.get(`/NbFactures/${user.id}`);
                setFactures(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des factures:', error);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await axiosInstance.get(`/NbClients/${user.id}`);
                setClients(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients:', error);
            }
        };

        const fetchRecentCommandes = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/RecentCommandes/${user.id}`);
                setRecentCommandes(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsersByCity = async () => {
            try {
                const response = await axiosInstance.get(`/getUsersByCity/${user.id}`);
                const transformedData = Object.entries(response.data || {}).map(([city, count]) => ({
                    city,
                    userCount: count
                }));
                setUsersByCity(transformedData);
                console.log(transformedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs par ville:', error);
            }
        };

        fetchClients();
        fetchCommandes();
        fetchFactures();
        fetchRecentCommandes();
        fetchUsersByCity();
    }, [user.id]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                    title="Total Clients"
                    count={clients ? String(clients.nbClientsTotal) : 'Chargement...'}
                    percentage={clients ? clients.percentageThisYear : null}
                    isLoss={clients?.status === 'loss'}
                    color={clients && clients.status === 'loss' ? 'warning' : undefined}
                    extra={clients && clients.extra ? clients.extra : undefined}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                    title="Total Commandes"
                    count={commandes ? String(commandes.nbCommandesTotal) : 'Chargement...'}
                    percentage={commandes ? commandes.percentageThisYear : null}
                    isLoss={commandes?.status === 'loss'}
                    color={commandes && commandes.status === 'loss' ? 'warning' : undefined}
                    extra={commandes && commandes.extra ? commandes.extra : undefined}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                    title="Total Factures"
                    count={factures ? String(factures.nbFacturesTotal) : 'Chargement...'}
                    percentage={factures ? factures.percentageThisYear : null}
                    isLoss={factures?.status === 'loss'}
                    color={factures && factures.status === 'loss' ? 'warning' : undefined}
                    extra={factures && factures.extra ? factures.extra : undefined}
                />
            </Grid>

            {/* row 2 - Graphique Utilisateurs par Ville */}
            
            <Grid item xs={12} md={7} lg={8}>
                <MainCard sx={{ mt: 2 }} title="Clients par Ville">
                    {usersByCity.length > 0 ? (
                        <DynamicBarChart data={usersByCity} />
                    ) : (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: '200px' }}>
                            <CircularProgress />
                        </Stack>
                    )}
                </MainCard>
            </Grid>

            {/* Historique des commandes */}
            <Grid item xs={12} md={5} lg={4}>
    <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
            <Typography variant="h5">Historique des commandes</Typography>
        </Grid>
    </Grid>
    <MainCard sx={{ mt: 2 }} content={false}>
        {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '200px' }}>
                <CircularProgress />
            </Stack>
        ) : (
            <List
                component="nav"
                sx={{
                    px: 0,
                    py: 0,
                    '& .MuiListItemButton-root': {
                        py: 1.5,
                    },
                }}
            >
                {recentCommandes.map((commande) => (
                    <ListItemButton
                        key={commande.id} // Ensure this is unique
                        divider
                        onClick={() => navigate('/commandes')} // Navigate to /commandes on click
                    >
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    color: 'success.main',
                                    bgcolor: 'success.lighter',
                                }}
                            >
                                <GiftOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography variant="subtitle1">#{commande.serial_number}</Typography>}
                            secondary={new Date(commande.created_at).toLocaleString()}
                        />
                        <ListItemSecondaryAction>
                            <Stack alignItems="flex-end">
                                <Typography variant="subtitle1" noWrap>
                                    + {commande.total_amount} DT
                                </Typography>
                            </Stack>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                ))}
            </List>
        )}
    </MainCard>

    {/* Add the Help and Support section here */}
    <MainCard sx={{ mt: 2 }}>
        <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h5" noWrap>
                        Aide et support
                    </Typography>
                </Grid>
            </Grid>
            <Button
                size="small"
                variant="contained"
                onClick={() => navigate('/settings/contact')} // Navigate to /contact on click
            >
                Besoin d'aide?
            </Button>
        </Stack>
    </MainCard>
</Grid>

        </Grid>
    );
}
