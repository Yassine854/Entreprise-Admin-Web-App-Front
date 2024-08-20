import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { GiftOutlined, TagsOutlined, InfoCircleOutlined } from '@ant-design/icons'; // Importing Mantis icons
import { useNavigate } from 'react-router-dom';

// ==============================|| DASHBOARD - SELECTION ||============================== //

export default function Selection() {
    const navigate = useNavigate();

    const handleSelection = (path) => {
        navigate(path); // Corrected navigation logic
    };

    return (
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
                <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                    Paramétrage du site
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item>
                        <Card
                            onClick={() => handleSelection('/packs')}
                            sx={{
                                cursor: 'pointer',
                                width: 300,
                                height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: '#f5f5f5',
                                ':hover': { boxShadow: 10, transform: 'scale(1.05)' },
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <GiftOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                                <Typography variant="h4" align="center" color="primary" mt={2}>
                                    Pack
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" mt={2}>
                                    Sélectionner parmi les différents packs disponibles sur le site.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item>
                        <Card
                            onClick={() => handleSelection('/offres')}
                            sx={{
                                cursor: 'pointer',
                                width: 300,
                                height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: '#f5f5f5',
                                ':hover': { boxShadow: 10, transform: 'scale(1.05)' },
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <TagsOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                                <Typography variant="h4" align="center" color="primary" mt={2}>
                                    Offre
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" mt={2}>
                                    Sélectionner parmi les différentes offres proposées.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item>
                        <Card
                            onClick={() => handleSelection('/parametres')}
                            sx={{
                                cursor: 'pointer',
                                width: 300,
                                height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: '#f5f5f5',
                                ':hover': { boxShadow: 10, transform: 'scale(1.05)' },
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <InfoCircleOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                                <Typography variant="h4" align="center" color="primary" mt={2}>
                                    Informations
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" mt={2}>
                                    Gérez les paramètres généraux du site.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
