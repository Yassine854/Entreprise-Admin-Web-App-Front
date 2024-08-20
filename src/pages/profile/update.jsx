import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Input,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    tel: user.tel || '',
    country: user.country || '',
    city: user.city || '',
    address: user.address || '',
    zip: user.zip || '',
    currentPassword: '',
    newPassword: '',
    newPassword_confirmation: '',
    image: null, // Set initially as null
  });

  const [errors, setErrors] = useState({
    profile: {},
    password: {},
  });

  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      setFormData({
        ...formData,
        image: event.target.files[0], // Set the file object
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        // Skip appending the image if it's null
        if (key === 'image' && formData[key] === null) {
          continue;
        }
        updatedFormData.append(key, formData[key]);
      }
    }

    try {
      axios.defaults.withCredentials = true;
      await axios.post(`https://example.shop/api/admins/update/${user.id}`, updatedFormData);

      const resp = await axios.get('https://example.shop/api/user');
      if (resp.status === 200) {
        localStorage.setItem('user', JSON.stringify(resp.data.data));
        setFormData({ ...formData, ...resp.data.data });
        setFormData(prevData => ({
          ...prevData,
          image: null, // Reset image to null after successful update
        }));
      }

      setAlertMessage('Profil mis à jour avec succès.');
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      setErrors((prevErrors) => ({
        ...prevErrors,
        profile: {},
      }));
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          profile: error.response.data.errors,
        }));
      }
    }
  };


  const cities = [
    'Tunis', 'Ariana', 'Ben Arous', 'La Manouba', 'Nabeul', 'Bizerte', 'Zaghouan', 'Beja',
    'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Gabes', 'Mednine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];

  return (
    <Container>
      {/* Flash message */}
      {alertMessage && (
        <Alert severity="success" style={{ marginBottom: '1rem' }}>
          {alertMessage}
        </Alert>
      )}

      <Typography variant="h4" align="center" gutterBottom>
        Profil
      </Typography>

      {/* Profile Update Form */}
      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} container justifyContent="center">
            <div style={{ textAlign: 'center' }}>
            <Avatar
  src={formData.image ? URL.createObjectURL(formData.image) : user.image ? `https://example.shop/storage/img/profile/${user.image}` : undefined}
  sx={{ width: 120, height: 120, marginBottom: 2 }}
/>

              <div>
                <Input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                  <Typography variant="caption">Modifier la photo</Typography>
                </label>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.profile.name}
                    helperText={errors.profile.name?.[0]}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    disabled
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Téléphone"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.profile.tel}
                    helperText={errors.profile.tel?.[0]}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    fullWidth
                    error={!!errors.profile.city}
                    helperText={errors.profile.city?.[0]}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Adresse"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.profile.address}
                    helperText={errors.profile.address?.[0]}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Code Postal"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.profile.zip}
                    helperText={errors.profile.zip?.[0]}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem' }}
                fullWidth
              >
                Mettre à jour
              </Button>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
