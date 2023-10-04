import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AUTH_TOKEN } from "../../constants";
import './ShowPicture.css';

function ShowPicture(props) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Fetch the user's profile picture URL from your API or server
    const email = localStorage.getItem("email");
    const headers = {
      'Authorization': `Bearer ${AUTH_TOKEN}`, 
    };

    axios.get(`https://p1apps-production.up.railway.app/api/v1/users/avatar/${email}`, { responseType: 'blob' , headers})
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl); 
      })
      .catch(error => {
        console.error('Error al obtener el archivo:', error);
      });
  }, []); // Empty dependency array to run this effect once

  return (
    <div className="show-picture">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="show-picture-image" />
      ) : (
        <p>No profile picture</p>
      )}
    </div>
  );
}

export default ShowPicture;
