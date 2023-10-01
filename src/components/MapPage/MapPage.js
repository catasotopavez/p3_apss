import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react'; // Para el componente de mapa
import { TextField, Button, Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
import './MapPage.css'; 
import mapIcon from './bluecircle.png';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const backey = localStorage.getItem('AUTH_TOKEN')
const CustomMarker = ({ text }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    <div style={{
      width: '30px',
      height: '30px',
      backgroundColor: 'red',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0', // Ajusta el margen aquí
    }}>
      {text}
    </div>
    <div style={{
      width: '0',
      height: '0',
      borderTop: '15px solid red',
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      margin: '-10px 0 0 0', // Ajusta el margen aquí
    }}></div>
  </div>
);

const MapPage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const handleResultClick2 = async (lat, lng, formatted_address) => {
    try {
      // Paso 1: Obtener el último viaje creado
      const tripsResponse = await fetch('http://localhost:3000/api/v1/trips', {
        headers: {
          Authorization: `Bearer ${backey}`,
        },
      });
  
      if (!tripsResponse.ok) {
        console.error('Error al obtener los viajes');
        return;
      }
  
      const tripsData = await tripsResponse.json();
  
      if (tripsData.length === 0) {
        console.error('No se encontraron viajes');
        return;
      }
  
      const lastTrip = tripsData[tripsData.length - 1];
  
      // Paso 2: Crear el destino y asociarlo al último viaje
      const data = {
        latitude: lat,
        longitude: lng,
        name: formatted_address, // Usa el nombre de la dirección como nombre del destino
      };
  
      const response = await fetch(`http://localhost:3000/api/v1/trips/${lastTrip.id}/destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${backey}`,
        },
        body: JSON.stringify({ destination: data }),
      });
  
      if (response.ok) {
        const newDestination = await response.json();
        console.log('Nuevo destino creado:', newDestination);
  
        setSelectedLocation({
          lat,
          lng,
        });
        setSearchLocation(formatted_address);
        setSearchResults([]);
        alert('Se ha guardado correctamente el destino, asociado al último viaje creado.');
      } else {
        console.error('Error al crear el destino');
      }
    } catch (error) {
      console.error('Error al crear el destino', error);
    }
  };
  
  useEffect(() => {
    if (selectedLocation) {
      // Center the map on the selected location when it changes
      setSelectedLocation(selectedLocation);
    }
  }, [selectedLocation]);
  
  const placeholderLocation = {
    lat: -33.45694, // Latitud del marcador de posición
    lng: -70.64827, // Longitud del marcador de posición
  };

  const handleSearchChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const handleSearch = async () => {
    try {
      // Specify the number of results you want (e.g., 10)
      const numResults = 10;
  
      // Check if the input matches the latitude and longitude pattern
      const latLngPattern = /^([-+]?\d+(\.\d+)?),\s*([-+]?\d+(\.\d+)?)$/;
      if (latLngPattern.test(searchLocation)) {
        // If it's a valid latlng pattern, split it into latitude and longitude
        const [latitude, longitude] = searchLocation.split(',').map(parseFloat);
  
        // Fetch geocode data from Google Maps API using latlng
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&result_type=street_address&limit=${numResults}`
        );
  
        const data = await response.json();
  
        if (data.status === 'OK' && data.results.length > 0) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } else {
        // If it's not a valid latlng pattern, perform a text-based search
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${apiKey}&result_type=street_address&limit=${numResults}`
        );
  
        const data = await response.json();
  
        if (data.status === 'OK' && data.results.length > 0) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Error fetching geocode data', error);
    }
  };
  
  
  

  const handleResultClick = (result) => {
    setSelectedLocation({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    });
    setSearchLocation(result.formatted_address);
    setSearchResults([]);
  };

  return (
    <div style={{ padding: '20px', width: '850px', marginTop: '85px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <TextField
          label="Search for a place"
          variant="outlined"
          fullWidth
          value={searchLocation}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key press
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          style={{ marginLeft: '10px', backgroundColor: 'rgb(135, 216, 135)', color: 'white' }}

        >
          Search
        </Button>
      </div>
      {searchResults.length > 0 && (
        <Paper elevation={3} style={{ padding: '10px', marginBottom: '10px', backgroundColor: 'white' }}>
          <List>
            {searchResults.map((result) => (
              <ListItem
                key={result.place_id}
                button
                onClick={() => handleResultClick(result)}
                className="pointer"
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#eee'; // Change background color on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <ListItemText primary={result.formatted_address} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Button
      onClick={() => {
        if (selectedLocation) {
          const { lat, lng } = selectedLocation;
          const formatted_address = searchLocation; // O utiliza el valor correcto aquí
          handleResultClick2(lat, lng, formatted_address);
        } else {
          console.error('No se ha seleccionado ninguna ubicación.');
        }
      }}
      variant="contained"
      color="primary"
      style={{
        marginTop: '10px',
        backgroundColor: 'rgb(135, 216, 135)',
        color: 'white',
      }}
    >
      Guardar Ubicación
    </Button>
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={placeholderLocation} // Change to your desired center
          defaultZoom={10} // Adjust the initial zoom level
          center={selectedLocation || placeholderLocation} // Use selectedLocation if available
        >
          {selectedLocation ? (
            <CustomMarker
            lat={selectedLocation.lat}
            lng={selectedLocation.lng}
            text=" "
          />
          ):null}
        </GoogleMapReact>
      </div>
      
    </div>
  );
};

export default MapPage;
