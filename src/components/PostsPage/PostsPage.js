import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { AUTH_TOKEN } from "./../../constants";
import { Link } from 'react-router-dom'; // Importa Link
import "./PostsPage.css"

function PostsPage() {
  const { tripId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamar al backend para obtener los posts del usuario actual y trip_id coincidente
    fetch(`http://localhost:3000/api/v1/posts/index_by_user_and_trip?trip_id=${tripId}&user=${localStorage.getItem("email")}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`, // Reemplaza AUTH_TOKEN con tu token
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Al recibir los datos, establece los posts y marca el estado como no cargando
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, [tripId]);

  return ( 
    <> 
      {loading ? (
        <SpinnerOfDoom />
      ) : (
        <div className={"GroupStack"}> 
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-box">
                <h3>Author: {post.author.first_name} {post.author.last_name}</h3>
                <p>Title: {post.title}</p>
                {/* Puedes mostrar otros datos del post aquí */}
                <Link to={`/trip/${tripId}/posts/${post.id}`} className="button-link">
                  Check this Post
                </Link>
              </div>
            ))
          ) : (
            <p>No se encontraron posts para este viaje.</p>
          )}
        </div>
      )}
    </>
  );
}

export default PostsPage;
