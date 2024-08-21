import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import {
  Container,
  Card,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    message: '',
    mail: '',  // Hidden field for email
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  // Load user email from localStorage and update formData
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setFormData(prevFormData => ({
        ...prevFormData,
        mail: user.email
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting submission
    try {
      const response = await axiosInstance.post('/contacts/create', formData);
      setAlertMessage('Message envoyé avec succès.');
      setTimeout(() => {
        setAlertMessage('');
    }, 3000);
      setFormData({
        name: '',
        mobile: '',
        message: '',
        mail: formData.mail // Keep the email in formData for next submission
      });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false); // Set loading to false when submission is complete
    }
  };

  return (
    <Container>
      {/* Display loading spinner while submitting */}
      {loading && (
        <CircularProgress
          style={{
            display: 'block',
            margin: '2rem auto',
          }}
        />
      )}

      {/* Display flash message after loading is complete */}
      {!loading && alertMessage && (
        <Alert severity="success" style={{ marginBottom: '1rem' }}>
          {alertMessage}
        </Alert>
      )}

      <Typography variant="h4" align="center" gutterBottom>
        Contactez-nous
      </Typography>

      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sujet"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.[0]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                fullWidth
                error={!!errors.mobile}
                helperText={errors.mobile?.[0]}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                fullWidth
                error={!!errors.message}
                helperText={errors.message?.[0]}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
            fullWidth
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
