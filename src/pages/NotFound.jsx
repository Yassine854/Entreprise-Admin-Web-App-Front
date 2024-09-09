import React from "react";
import { Typography, Button, Container, Box } from "@mui/material";
import FlagIcon from '@mui/icons-material/Flag';
import { useNavigate } from 'react-router-dom';

export function ErrorSection7() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box textAlign="center">
        <FlagIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h1" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: 500 }}>
          Erreur 404 <br /> Il semble qu'il y ait un problème.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Ne vous inquiétez pas, notre équipe est déjà sur le coup. Veuillez essayer de
          rafraîchir la page ou revenir plus tard.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '100%' }}
          onClick={handleBackHome}
        >
          Accueil
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorSection7;
