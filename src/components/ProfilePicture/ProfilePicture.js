import React, { useState } from 'react';
import axios from 'axios';
import { AUTH_TOKEN } from "../../constants";
import './ProfilePicture.css'; // Importa el archivo CSS

function ProfilePicture() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const email = localStorage.getItem("email");
      console.log(AUTH_TOKEN)

      const headers = {
        'Authorization': `Bearer ${AUTH_TOKEN}`, 
      };
      const response = await axios.patch(`http://localhost:3000/api/v1/users/${email}`, formData, { headers });
      console.log(response.data);
    } catch (error) {
      console.error('Error al actualizar el avatar:', error);
    }
    window.location.reload();
  };

  return (
    <div className="profile-picture-container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className="update-button" onClick={handleUpdate}>Actualizar Avatar</button>
    </div>
  );
}

export default ProfilePicture;
