import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Box, Typography, CircularProgress, styled, Button } from '@mui/material';
import Container from '@mui/material/Container';
import axios from 'axios';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const GET_TRIP_DETAILS = gql`
  query GetTripDetails($tripId: ID!) {
    trip(id: $tripId) {
      id
      name
      description
      startDate
      endDate
    }
  }
`;

const GoogleMapComponent = withScriptjs(withGoogleMap((props) => {
  const navigate = useNavigate();

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: -33.45694, lng: -70.64827 }}
    >
      {props.destinations.map((destination) => (
        <Marker
          key={destination.id}
          position={{ lat: destination.latitude, lng: destination.longitude }}
          onClick={() => navigate(`/destinations/${destination.id}`)}
        />
      ))}
    </GoogleMap>
  );
}));

const googleApi = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function TripPage() {
  const { tripId } = useParams();
  const { loading, error, data } = useQuery(GET_TRIP_DETAILS, {
    variables: { tripId },
  });

  const [tripDestinations, setTripDestinations] = useState([]);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6">Error: {error.message}</Typography>;
  }

  const trip = data.trip;

  return (
    <Container
      maxWidth="md" // Set maximum width
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: '20px' }}
    >
    <div style={{ marginTop: '60px', marginLeft: '40px !important' }}>
      <Typography variant="h4">{trip.name}</Typography>
      <Typography variant="subtitle1">{trip.description}</Typography>
      <Typography variant="body1">
        Start Date: {new Date(trip.startDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body1">
        End Date: {new Date(trip.endDate).toLocaleDateString()}
      </Typography>
    </div>

      <Typography variant="body1">
        Trip Destinations:
        {tripDestinations.length === 0 ? (
          <p>
            Currently, there are no destinations associated with this trip. Add a destination on the map by clicking "Save Location" to see it here.
          </p>
        ) : (
          <ul>
            {tripDestinations.map((destination) => (
              <li key={destination.id}>{destination.name}</li>
            ))}
          </ul>
        )}
      </Typography>

      <GoogleMapComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleApi}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '400px', width: '100%' }} />}
        containerElement={<div style={{ height: '400px', width: '100%' }} />}
        mapElement={<div style={{ height: '400px', width: '100%' }} />}
        destinations={tripDestinations}
      />

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate(`/${trip.id}/posts`)}
      >
        Go to Posts
      </Button>
    </Container>
  );
}

export default TripPage;
