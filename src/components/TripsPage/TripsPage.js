import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import TripCard from './TripCard/TripCard';
import {
  Fab,
  Paper,
  Stack,
  styled,
  Typography,
  Skeleton,
  Grid,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import { useScrollDirection } from 'react-use-scroll-direction';
import { generatePath, useNavigate, Link } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const GET_DATA = gql`
  query GetUserData($email: String!) {
    user(email: $email) {
      firstName
      email
      trips {
        id
        name
        description
        startDate
        endDate
      }
    }
  }
`;

function TripsPage({ email }) {
  const token = localStorage.getItem('AUTH_TOKEN');
  const isAuthenticated = !!token;
  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { email },
    context: isAuthenticated
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  });
  const [extended, setExtended] = useState(true);
  const [newtrip, setNewTrip] = useState(true);
  const { isScrollingUp, isScrollingDown } = useScrollDirection();

  let ext = extended ? 'extended' : 'circular';
  let nt = newtrip ? 'New Trip' : '';

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingUp) {
        setExtended(true);
        setNewTrip(true);
      }
      if (isScrollingDown) {
        setExtended(false);
        setNewTrip(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollingUp, isScrollingDown]);

  return (
    <div className={'GroupStack'} style={{ position: 'relative' }}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        overflow={'scroll'}
        sx={{ mx: 2, mt: '90px' }}
      >
        <Grid container wrap="nowrap">
          {loading ? (
            // Skeleton loading while data is being fetched
            Array.from({ length: 5 }).map((_, index) => (
              <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
                <Skeleton variant="rectangular" width={210} height={118} />
                <Box sx={{ pr: 2 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              </Box>
            ))
          ) : error ? (
            // Error message
            window.location.href = '/login'
          ) : data?.user?.trips?.length === 0 ? (
            // Message when there are no trips
            <Typography variant="h5">
              You haven't created any trips yet.
            </Typography>
          ) : (
            // Render trip cards
            data.user.trips.map((trip) => (
              <Item key={trip.id}>
                <TripCard trip={trip} />
              </Item>
            ))
          )}
        </Grid>
      </Stack>
      <Fab
        color="primary"
        aria-label="add"
        className={'NewTripFab'}
        id={'NewTrip'}
        variant={ext}
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        <AddIcon /> <div id={'NewTripText'}>{nt}</div>
      </Fab>
    </div>
  );
}

export default TripsPage;
