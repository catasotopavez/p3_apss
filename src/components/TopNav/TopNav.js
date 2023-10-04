import React, { useState, useEffect } from "react";
import './TopNav.css';
import { Avatar, Box, Button, Container, Menu, MenuItem } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

function TopNav(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const [avatarUrl, setAvatarUrl] = useState(null); // State for avatarUrl
  const AUTH_TOKEN = process.env.REACT_APP_AUTH0_CLIENT_ID;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isLoggedIn = props.isLoggedIn;

  useEffect(() => {
    if (!userEmail) {
      return; // No need to fetch if userEmail is not available
    }

    // Fetch the user's profile picture URL based on their email
    const headers = {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
    };

    axios.get(`https://p1apps-production.up.railway.app/api/v1/users/avatar/${userEmail}`, { responseType: 'blob', headers })
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);
      })
      .catch(error => {
        console.error('Error al obtener el archivo:', error);
      });
  }, [userEmail]); // Include userEmail as a dependency

  const handleLogout = () => {
    setShowNotification(true);
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('email');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const closeNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  return (
    <Box className={"BoxNav"}>
      <Container sx={{ width: '100%', height: '85px', position: 'fixed', top: 0, left: 0 }}>
        <p className={"AppName"}>Travel Log</p>
     
        {showNotification && (
          <Snackbar
            open={showNotification}
            autoHideDuration={2000}
            onClose={closeNotification}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={closeNotification}
              severity="error"
            >
              Has cerrado sesión
            </MuiAlert>
          </Snackbar>
        )}

        <Button
          id="profile-button"
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ position: 'absolute', top: '16px', left: '16px' }}
        >
          <Avatar alt="Profile Picture" src={avatarUrl} />
        </Button>
  
        <Menu
          id="profile-menu"
          spacing={2}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'profile-button',
          }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}

export default TopNav;
