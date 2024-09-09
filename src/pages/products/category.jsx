import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../../axiosInstance';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate(); // Initialize useNavigate
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(`/categories/${user.id}`);
                setCategories(response.data);
            } catch (error) {
                console.error('Échec de la récupération des catégories:', error);
            }
        };
        fetchCategories();
    }, [user.id]);

    const handleNavigate = (categoryId, categoryName) => {
        navigate(`/products/categories/${categoryId}`, { state: { categoryName } });
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
