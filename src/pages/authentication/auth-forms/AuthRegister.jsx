import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tunisianCities = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia', 'Kairouan', 'Sfax',
    'Gabès', 'Mednine', 'Tataouine', 'Kasserine', 'Jendouba', 'Siliana', 'Zaghouan', 'Bizerte', 'Beja', 'Kebili',
    'Gafsa', 'Sidi Bouzid', 'Médénine', 'Tozeur', 'Kef'
  ];

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const fetchCsrfToken = async () => {
    try {
        axios.defaults.withCredentials = true;

      await axios.get('https://example.shop/api/csrf-cookie');
      console.log("done");
    } catch (err) {
      setError('Failed to fetch CSRF token. Please try again.');
    }
  };

  const handleSubmit = async (values) => {
    await fetchCsrfToken();
    try {
      const response = await axios.post('https://example.shop/api/CreateAdmin', {
        name: values.name,
        email: values.email,
        tel: values.tel,
        city: values.city,
        address: values.address,
        zip: values.zip,
        password: values.password
      });

      if (response.status === 200) {  // assuming a 200 status indicates success
        const { user } = response.data;

        // Store user data and token in local storage
        localStorage.setItem('user', JSON.stringify(user));

        // Navigate to the dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      // Show error messages from the server response
      if (err.response && err.response.data && err.response.data.errors) {
        const serverErrors = err.response.data.errors;
        setError(serverErrors);
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          tel: '',
          city: '',
          address: '',
          zip: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Le nom est requis'),
          email: Yup.string().email('Email non valide').max(255).required("L'email est requis"),
          tel: Yup.string().matches(/^\d{8}$/, "Le téléphone doit comporter 8 chiffres").required('Le téléphone est requis'),
          city: Yup.string().max(255).required('La ville est requise'),
          address: Yup.string().max(255).required('L’adresse est requise'),
          zip: Yup.string().matches(/^\d{4}$/, "Le code postal doit comporter 4 chiffres").required('Le code postal est requis'),
          password: Yup.string().max(255).required('Le mot de passe est requis')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Nom*</InputLabel>
                  <OutlinedInput
                    id="name-signup"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Entrez votre nom"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                </Stack>
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-text-name-signup">
                    {errors.name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Adresse Email*</InputLabel>
                  <OutlinedInput
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Entrez votre adresse email"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="tel-signup">Téléphone*</InputLabel>
                  <OutlinedInput
                    id="tel-signup"
                    type="text"
                    value={values.tel}
                    name="tel"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Entrez votre numéro de téléphone"
                    fullWidth
                    error={Boolean(touched.tel && errors.tel)}
                  />
                </Stack>
                {touched.tel && errors.tel && (
                  <FormHelperText error id="helper-text-tel-signup">
                    {errors.tel}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
  <Stack spacing={1}>
    <InputLabel htmlFor="city-signup">Ville*</InputLabel>
    <Select
      labelId="city-select-label"
      id="city-select"
      value={values.city}
      name="city"
      onBlur={handleBlur}
      onChange={handleChange}
      displayEmpty
      placeholder="Sélectionner ville"
    >
      <MenuItem value="" disabled>Sélectionner ville</MenuItem>
      {tunisianCities.map((city) => (
        <MenuItem key={city} value={city}>{city}</MenuItem>
      ))}
    </Select>
  </Stack>
  {touched.city && errors.city && (
    <FormHelperText error id="helper-text-city-signup">
      {errors.city}
    </FormHelperText>
  )}
</Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="address-signup">Adresse*</InputLabel>
                  <OutlinedInput
                    id="address-signup"
                    type="text"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Entrez votre adresse"
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />
                </Stack>
                {touched.address && errors.address && (
                  <FormHelperText error id="helper-text-address-signup">
                    {errors.address}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="zip-signup">Code Postal*</InputLabel>
                  <OutlinedInput
                    id="zip-signup"
                    type="text"
                    value={values.zip}
                    name="zip"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Entrez votre code postal"
                    fullWidth
                    error={Boolean(touched.zip && errors.zip)}
                  />
                </Stack>
                {touched.zip && errors.zip && (
                  <FormHelperText error id="helper-text-zip-signup">
                    {errors.zip}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Mot de Passe*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Entrez votre mot de passe"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          bgcolor: `${level ? level.color : 'transparent'}`,
                          height: 8,
                          borderRadius: 1
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        {level ? level.label : 'Choisissez un mot de passe'}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {error && Object.keys(error).map((key) => (
                  <FormHelperText error key={key}>
                    {error[key].join(', ')}
                  </FormHelperText>
                ))}
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    S'inscrire
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Typography component="span" variant="body2">
                  Vous avez déjà un compte ?&nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="/login">
                    Connectez-vous
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
