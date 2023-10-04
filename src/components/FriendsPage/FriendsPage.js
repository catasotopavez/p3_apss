import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MuiAlert from "@mui/material/Alert";

function FriendsPage(props) {
  const buttonStyle = {
    padding: '10px 20px', // Ajusta el tamaño del botón aumentando el padding
    fontSize: '16px',     // Ajusta el tamaño del texto del botón,
    margin: '5px'
  };

  return (
    <div style={{ padding: '20px', width: '300px', marginTop: '60px', display: 'flex', flexDirection: 'column' }}>
      <h1>Mis Amigos</h1>
      <Link to="/friendship-qr">
        <button style={buttonStyle}>Crear QR</button>
      </Link>
      <Link to="/friendship-scan">
        <button style={buttonStyle}>Escanear QR</button>
      </Link>
    </div>
  );
}

export default FriendsPage;
