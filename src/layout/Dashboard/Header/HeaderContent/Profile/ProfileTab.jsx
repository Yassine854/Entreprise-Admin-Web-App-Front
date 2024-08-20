import PropTypes from 'prop-types';
import { useState } from 'react';
import  axios  from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    if (path) {
        navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
        axios.defaults.withCredentials = true;
        const resp = await axios.post('https://example.shop/api/logout');
        if (resp.status === 200) {
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    } catch (error) {
        console.log(error);
    }
};

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0, '/profile/update')}
      >
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Modifier Profil" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={(event) => handleListItemClick(event, 1, '/profile/show')}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Voir Profil" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 2}
        onClick={handleLogout}
      >
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Déconnexion" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = {
  handleLogout: PropTypes.func, // No longer required, since it's defined internally
};
