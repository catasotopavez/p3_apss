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
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        overflow={"scroll"}
        sx={{ mx: 2, mt: "90px" }}
      >
        <React.Fragment>
          {user && (
            <div>
            <h1>PROFILE INFO</h1>
            <br></br>
            <div className="user-details">
              <p className="user-info">First Name: {user.firstName}</p>
              <p className="user-info">Last Name: {user.lastName}</p>
              <p className="user-info">Email: {user.email}</p>
              <p className="user-info">Phone: {user.phone}</p>
              <p className="user-info">Description: {user.description}</p>
            </div>
            </div>
          )}
        </React.Fragment>
        <br></br>
        <ProfilePicture />
        <ShowPicture />
        <br></br>
        <br></br>
        <br></br>
      </Stack>
    </div>
  );
}

export default ProfilePage;



