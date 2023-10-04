import React, { useState, useEffect } from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { Fab, Paper, Stack, styled } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import ShowPicture from '../ProfilePage/ShowPicture';

// Agrega estilos CSS para el componente ProfilePage
import './ProfilePage.css'; // Importa el archivo CSS

function ProfilePage() {
  const email = localStorage.getItem("email");

  const GET_DATA = gql`
    query {
      user(email: "${email}") {
        firstName
        lastName
        email
        phone
        description
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <CircularProgress />;
  if (error) return <h1>Error: {error.message}</h1>;

  const user = data.user; // Almacena el objeto de usuario en una variable

  return (
    <div className="profile-page-container">
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
        overflow={"scroll"}
        sx={{ mx: 2, mt: "90px" }}
      >
        <div className="profile-content">
          <ProfilePicture />
          <ShowPicture />
        </div>
        <div className="user-information">
          {user && (
            <div>
              <h1>User Information</h1>
              <div className="user-details">
                <p className="user-info"><strong>Name:</strong> {user.firstName}</p>
                <p className="user-info"><strong>Last Name:</strong> {user.lastName}</p>
                <p className="user-info"><strong>Email:</strong> {user.email}</p>
                <p className="user-info"><strong>Phone:</strong> {user.phone}</p>
                <p className="user-info"><strong>Description:</strong> {user.description}</p>
              </div>
            </div>
          )}
        </div>
      </Stack>
    </div>
  );
  
  
  
}

export default ProfilePage;



