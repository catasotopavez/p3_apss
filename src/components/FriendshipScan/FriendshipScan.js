import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MuiAlert from "@mui/material/Alert";
import { QrReader } from 'react-qr-reader'
import { Container } from '@mui/material'

function FriendsPage(props) {
  const [linkInput, setLinkInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const authToken = localStorage.getItem('AUTH_TOKEN');

  const showAlert = (message) => {
    alert(message);
}

  const closeNotification = () => {
    // Agrega lógica para cerrar la notificación aquí si es necesario
    setSuccessMessage('');
    setErrorMessage('');
  };


  const sendFriendRequest = (result) => {
    const urlParams = new URLSearchParams(result);
    const friendId = urlParams.get('user_id');
    console.log(urlParams)
    if (friendId) {
      const apiUrl = `https://p1apps-production.up.railway.app/api/v1/friendships/${friendId}`;
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setSuccessMessage(data.message);
            setErrorMessage('');

          } else {
            const errorData = await response.json();
            setErrorMessage(`Error al crear la amistad: ${errorData.error}`);
            setSuccessMessage('');
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      console.error('No se encontró el ID del amigo en el enlace.');
    }
  };

  return (
    <div style={{ padding: '20px', width: '600px', marginTop: '60px', display: 'flex', flexDirection: 'column' }}>
    <h1>Escanea el QR</h1>
    {successMessage && (
        <MuiAlert elevation={6} variant="filled" onClose={closeNotification} severity="success" >
          {successMessage}
        </MuiAlert>
      )}
      {errorMessage && (
        <MuiAlert elevation={6} variant="filled" onClose={closeNotification} severity="error" >
          {errorMessage}
        </MuiAlert>
      )}
      <Container
        >
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setLinkInput(result?.text);
                        showAlert(`¡Código correctamente escaneado!`);
                        sendFriendRequest(result.text);
                    }

                    if (!!error) {
                        
                    }
                }}
              
            />
        </Container>
      
    </div>
  );
}

export default FriendsPage;
