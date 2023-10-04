import React, { useState } from 'react';
import MuiAlert from "@mui/material/Alert";
import { QrReader } from 'react-qr-reader'
import { Container } from '@mui/material'

function FriendshipScan(props) {
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

  const getCurrentPositionAsync = () => {
    return new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  const sendFriendRequest = async (result) => {
    const urlParams = new URLSearchParams(result);
    const friendId = urlParams.get('user_id');
    const friendshipToken = urlParams.get('friendship_token');
    console.log('friendshipToken:', friendshipToken);

    if (friendId) {
      const apiUrl = `https://p1apps-production.up.railway.app/api/v1/friendships`;
      
      if (friendshipToken) {
        const timestamp = parseInt(friendshipToken, 10);
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleString();

        // Obtén la hora actual en segundos (timestamp)
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Calcula la diferencia de tiempo en segundos
        const timeDifference = currentTimestamp - timestamp;

        // Verifica si ha pasado más de un minuto (60 segundos)
        if (timeDifference >= 60) {
          showAlert('Ha pasado más de un minuto desde la creación del QR. Debes generar otro QR');
          // No hagas el fetch y regresa
          return;
        }
      }
      const position = await getCurrentPositionAsync();
      const {latitude,longitude} = position.coords;


      const to_send = {"friendId":friendId,"gps_coord":{"latitude":latitude,"longitude":longitude}}
      const dataJson = JSON.stringify(to_send)
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body:dataJson
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
      <Container>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setLinkInput(result?.text);
              showAlert(`¡Código correctamente escaneado!`);
              sendFriendRequest(result.text);
            }

            if (!!error) {
              // Manejar el error si es necesario
            }
          }}
        />
      </Container>
    </div>
  );
}

export default FriendshipScan;