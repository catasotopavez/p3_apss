import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import Container from '@mui/material/Container';

// Define la consulta GraphQL para obtener los detalles del destino
const GET_DESTINATION_DETAILS = gql`
  query GetDestinationDetails($destinationId: ID!) {
    destination(id: $destinationId) {
      id
      name
      latitude
      longitude
    
    }
  }
`;

function DestinationPage() {
  // Obtén el ID del destino de los parámetros de la URL
  const { destinationId } = useParams();
  console.log(destinationId)

  // Utiliza el hook useQuery para obtener los detalles del destino
  const { loading, error, data } = useQuery(GET_DESTINATION_DETAILS, {
    variables: { destinationId },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6">Error: {error.message}</Typography>;
  }

  // Extrae los datos del destino desde la respuesta GraphQL
  const destination = data.destination;

  return (
    <Container 
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        overflow={"scroll"}
        sx={{ mx: 2, mt: '90px' }}
        >

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4">{destination.name}</Typography>
        <Typography variant="body1">Latitude: {destination.latitude}</Typography>
        <Typography variant="body1">Longitude: {destination.longitude}</Typography>
        {/* Agrega otros campos del destino según sea necesario */}
      </Paper>
    </Container>
  );
}

export default DestinationPage;

