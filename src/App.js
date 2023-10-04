import React, { useState,useEffect } from 'react';
import {
  HashRouter,
  Route,
  Routes,
  
  Navigate,
} from 'react-router-dom';
import TripsPage from './components/TripsPage';
import BottomBar from './components/BottomBar/BottomBar';
import TopNav from './components/TopNav/TopNav';
import HomePage from './components/HomePage/HomePage';
import FriendsPage from './components/FriendsPage/FriendsPage';
import MapPage from './components/MapPage/MapPage';
import SearchPage from './components/SearchPage/SearchPage';
import LoginPage from './components/LoginPage/LoginPage';
import TripPage from './components/TripPage/TripPage';
import DestinationPage from './components/DestinationPage/DestinationPage';
import ProfilePage from "./components/ProfilePage/ProfilePage";
import PostsPage from "./components/PostsPage/PostsPage";
import FriendshipQRCode from "./components/FriendshipQRCode/FriendshipQRCode"
import FriendshipScan from "./components/FriendshipScan/FriendshipScan"
import PostPage from "./components/PostPage/PostPage"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in on page load
    const storedToken = localStorage.getItem('AUTH_TOKEN');
    if (storedToken) {
      setIsLoggedIn(true);
      setUserEmail(localStorage.getItem('email'));
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUserEmail(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear the authentication token and user data from local storage
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('email');
    // You can add additional logout logic here if needed
  };


  return (
    <div className="App">
      <HashRouter>
        <div className="App__content">
          {isLoggedIn ? (
            <>
              <TopNav avatarUrl={avatarUrl} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/trips" element={<TripsPage email={userEmail} />} />
                <Route exact path="/friends" element={<FriendsPage />} />
                <Route exact path="/map" element={<MapPage />} />
                <Route exact path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/trip/:tripId" element={<TripPage />} />
                <Route path= "/destinations/:destinationId" element={<DestinationPage />} />
                <Route path="/friendship-qr" element={<FriendshipQRCode />} />
                <Route exact path="/profile" element={<ProfilePage />} />
                <Route path="/:tripId/posts" element={<PostsPage />} />
                <Route path="/friendship-scan" element={<FriendshipScan />} />
                <Route path="/trip/:tripId/posts/:postId" element={<PostPage />} />
              </Routes>
              <BottomBar />
            </>
          ) : (
            <LoginPage onLogin={handleLogin} />
          )}
        </div>
      </HashRouter>
    </div>
  );
}

export default App;