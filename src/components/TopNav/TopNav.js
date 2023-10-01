import React, { Component, useState} from "react";
import './TopNav.css';
import { Avatar, Box, Button, Container, Menu, MenuItem } from "@mui/material";
import { Rectangle } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';


function TopNav(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [showNotification, setShowNotification]= useState(false)
  const navigate = useNavigate(); 
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isLoggedIn = props.isLoggedIn; // Asegúrate de pasar el estado isLoggedIn como prop

  if (!isLoggedIn) {
    return null; // No mostrar TopNav si el usuario no está autenticado
  }

  const handleLogout= () => {
    setShowNotification(true);
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('email');
    setTimeout(() => {
      window.location.reload();
    }, 2000); // Espera 2000 milisegundos (2 segundos)
  }

  const closeNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose(); // Close the menu
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
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" left={0} position={"absolute"} />
        
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
