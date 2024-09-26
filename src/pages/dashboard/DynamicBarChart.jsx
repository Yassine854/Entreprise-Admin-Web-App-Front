import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ReactApexChart from 'react-apexcharts';

const DynamicBarChart = ({ data }) => {
  const theme = useTheme();

  const [series, setSeries] = useState([
    {
      name: 'Utilisateurs',
      data: []
    }
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 365,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Nombre d\'utilisateurs'
      }
    },
    grid: {
      show: false
    },
    colors: [theme.palette.primary.main] // Utiliser la couleur primaire du thème
  });

  useEffect(() => {
    // Mettre à jour les données du graphique en fonction des nouvelles données
    if (data && data.length > 0) {
      setSeries([{ name: 'Utilisateurs', data: data.map(item => item.userCount) }]);
      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          categories: data.map(item => item.city)
        }
      }));
    }
  }, [data]);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
};

export default DynamicBarChart;
