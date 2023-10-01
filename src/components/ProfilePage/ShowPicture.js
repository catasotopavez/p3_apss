import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AUTH_TOKEN } from "../../constants";
import './ShowPicture.css';

function ShowPicture() {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const headers = {
      'Authorization': `Bearer ${AUTH_TOKEN}`, 
    };

    axios.get(`http://localhost:3000/api/v1/users/avatar/${email}`, { responseType: 'blob' , headers})
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl); 
      })
      .catch(error => {
        console.error('Error al obtener el archivo:', error);
      });
  }, []);
  

  return (
    <div className="show-picture-container">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="show-picture-image" />
      ) : (
        <p>Imagen de perfil no encontrada</p>
      )}
    </div>
  );
}

export default ShowPicture;


