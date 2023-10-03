import React, { useState } from 'react';
import {
  Container,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const paperStyle = { padding: 20, height: '90vh', width: 500, margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#1bbd7e' };
  const btnstyle = { margin: '8px 0' };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const base64Credentials = btoa(`${username}:${password}`);
      const response = await Axios.post('https://p1apps-production.up.railway.app/api/v1/api-keys', null, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      const responseData = response.data;
      const token = responseData.token;
      localStorage.setItem('AUTH_TOKEN', token);
      onLogin(username); // Notify the parent component about successful login
      localStorage.setItem('email', username);
      localStorage.setItem('PASSWORD', password);
      navigate('/trips');
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      setError('Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', background: 'white' }}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
          <h2>Log In</h2>
        </Grid>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField label='Username' placeholder='Enter username' fullWidth required value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label='Password' placeholder='Enter password' type='password' fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FormControlLabel
            control={
              <Checkbox
                name="checkedB"
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Log In</Button>
        </form>
        <Typography >
          <Link href="#">
            Forgot password?
          </Link>
        </Typography>
        <Typography > Do you have an account ?
          <Link href="#">
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}
