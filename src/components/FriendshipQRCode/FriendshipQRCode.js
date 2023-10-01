import React, { useEffect, useState } from 'react';

const FriendshipQRCode = () => {
  const [qrImage, setQrImage] = useState(null);
  const authToken = localStorage.getItem('AUTH_TOKEN');
  // Lógica para obtener el token de amistad del backend
  useEffect(() => {
    const headers = {
        Authorization: `Bearer ${authToken}`,
      };
    // Realiza una solicitud HTTP al backend para obtener el token de amistad
    fetch('http://localhost:3000/friendship_tokens/show', {
      headers, // Agrega los encabezados con el token de autorización
    })
      .then((response) => response.blob())
      .then((blob) => {
        const qrImageURL = URL.createObjectURL(blob);
        setQrImage(qrImageURL);
      })
      .catch((error) => {
        console.error('Error al obtener el código QR:', error);
      });
  }, [authToken]);

  return (
    <div style={{ padding: '20px', width: '300px', marginTop: '60px', display: 'flex', flexDirection: 'column' }}>
      <h2>Frienship QR Code</h2>
      {qrImage ? <img src={qrImage} alt="Código QR de amistad" /> : <p>Cargando código QR...</p>}
    </div>
  );
};

export default FriendshipQRCode;
