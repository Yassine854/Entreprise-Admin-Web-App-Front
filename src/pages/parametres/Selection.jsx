import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { GiftOutlined, InfoCircleOutlined,FileImageOutlined  } from '@ant-design/icons'; // Importing Mantis icons
import { useNavigate } from 'react-router-dom';

// ==============================|| DASHBOARD - SELECTION ||============================== //

export default function Selection() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSelection = (path) => {
        navigate(path); // Corrected navigation logic
    };

    return (
        <Container maxWidth={false} disableGutters >
            <CardContent>
            <Grid container spacing={4} alignItems="center" justifyContent="center" direction="column">
                <Grid item xs={12}>
                    <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                        Paramétrage du site
                    </Typography>
                </Grid>
                <Grid  container item spacing={4} justifyContent="center">
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
                            onClick={() => handleSelection(`/slides/${user.id}`)}
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
                                <FileImageOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                                <Typography variant="h4" align="center" color="primary" mt={2}>
                                    Slides
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" mt={2}>
                                    Gérer votre slides.
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
            </CardContent>
        </Container>
    );
}
