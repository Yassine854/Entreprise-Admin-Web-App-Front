import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button,Grid,Typography, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../../axiosInstance';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate(); // Initialize useNavigate
    const user = JSON.parse(localStorage.getItem('user'));
    const [parametre, setParametre] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch parametre
                const parametreResponse = await axiosInstance.get(`/parametres/show/${user.id}`);
                setParametre(parametreResponse.data.parametre);

                // Fetch categories only if parametre is successfully fetched
                if (parametreResponse.data.parametre?.nature_id) {
                    const categoriesResponse = await axiosInstance.get(`/categories/${parametreResponse.data.parametre.nature_id}`);
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                if (error.message.includes('parametre')) {
                    setError('Échec de la récupération des paramétres.');
                } else {
                    setError('Échec de la récupération des catégories.');
                }
                console.error(error);
            }
        };
        fetchCategories();
    }, [user.id]);

    const handleNavigate = (categoryId, categoryName) => {
        navigate(`/products/categories/${user.id}/${categoryId}`, { state: { categoryName } });
    };

    const columns = [
        {
            name: 'Nom',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleNavigate(row._id, row.name)}
                >
                    Produits
                </Button>
            ),
        },
    ];

    return (


        <Container maxWidth={false} disableGutters>
            <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
            {'Liste des catégories'}
        </Typography>

        </Grid>
            <DataTable
                columns={columns}
                data={categories}
                pagination
                highlightOnHover
                pointerOnHover
                theme={theme.palette.mode}
            />
        </Container>
    );
};

export default CategoryList;
