//Create starter component
import React from 'react';
import { Link } from 'react-router-dom';

function FriendsPage(props) {
    return (
        <div style={{ padding: '20px', width: '300px', marginTop: '60px', display: 'flex', flexDirection: 'column' }}>
             <h1>Mis Amigos</h1>
            <Link to="/friendship-qr">
            <button>Crear QR</button>
            </Link>
    </div>
    );
}

export default FriendsPage;