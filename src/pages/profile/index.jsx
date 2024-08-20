import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Grid,
  Typography,
  Avatar,
  Box,
  Divider,
  Button,
  CircularProgress,
  styled
} from '@mui/material';

const ProfileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.background.paper}`,
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

const EditButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export default function imagee() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        axios.defaults.withCredentials = true;

        const response = await axios.get(`https://example.shop/api/user`);
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [user.id]);

  if (!profileData) {
    return (
      <Container>
        <CircularProgress color="primary" />
        <Typography variant="h6" align="center" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>


      <ProfileCard>
        <ProfileAvatar
          src={profileData.image ? `https://example.shop/storage/img/profile/${profileData.image}` : undefined}
        />
        <ProfileInfo>
        <Typography variant="h4" align="center" gutterBottom>
        {user.name}
      </Typography>
          <Divider sx={{ margin: '1rem 0' }} />
          <Grid container spacing={2}>

            <InfoGrid item xs={12} md={6}>
              <InfoLabel variant="body1">Email:</InfoLabel>
              <InfoValue variant="body1">{profileData.email}</InfoValue>
            </InfoGrid>
            <InfoGrid item xs={12} md={6}>
              <InfoLabel variant="body1">Téléphone:</InfoLabel>
              <InfoValue variant="body1">{profileData.tel}</InfoValue>
            </InfoGrid>
            <InfoGrid item xs={12} md={6}>
              <InfoLabel variant="body1">Ville:</InfoLabel>
              <InfoValue variant="body1">{profileData.city}</InfoValue>
            </InfoGrid>
            <InfoGrid item xs={12} md={6}>
              <InfoLabel variant="body1">Adresse:</InfoLabel>
              <InfoValue variant="body1">{profileData.address}</InfoValue>
            </InfoGrid>
            <InfoGrid item xs={12} md={6}>
              <InfoLabel variant="body1">Code Postal:</InfoLabel>
              <InfoValue variant="body1">{profileData.zip}</InfoValue>
            </InfoGrid>
          </Grid>
        </ProfileInfo>

      </ProfileCard>
    </Container>
  );
}
