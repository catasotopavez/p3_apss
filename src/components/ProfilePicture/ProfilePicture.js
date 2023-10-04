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
      const response = await axios.patch(`https://p1apps-production.up.railway.app/api/v1/users/${email}`, formData, { headers });
      console.log(response.data);
    } catch (error) {
      console.error('Error al actualizar el avatar:', error);
    }
    window.location.reload();
  };

  return (
    <div className="buttons-container">
  <label className="file-input-label">
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="file-input"
    />
    Upload Image
  </label>
  <button className="update-button" onClick={handleUpdate}>
    Actualizar
  </button>
</div>


  );
}

export default ProfilePicture;
