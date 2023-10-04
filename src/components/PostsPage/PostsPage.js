import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AUTH_TOKEN } from "./../../constants";
import { Link } from 'react-router-dom'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';


function PostsPage() {
  const {tripId} = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`https://p1apps-production.up.railway.app/api/v1/posts/index_by_user_and_trip?trip_id=${tripId}&user=${localStorage.getItem("email")}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        
      })
      .catch((error) => {
        console.error('Could´nt fetch any posts', error);
      
      });
  }, [tripId]);

  return (
    <Container direction="column" justifyContent="flex-start" alignItems="center"spacing={2} sx={{ mx: 2, mt: '90px' }}>
  {posts.length > 0 ? (
  posts.map((post) => (
    <Card key={post.id} className="card" style={{ width: '18rem', margin: '1rem' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" component="div">
          Author: {post.author.first_name} {post.author.last_name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="div">
          {post.body}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/trip/${tripId}/posts/${post.id}`}color="primary">View Post</Button>
      </CardActions>
    </Card>
  ))) : (<p>No associated posts for this trip.</p>)}
    </Container>
  );
}  

export default PostsPage;
