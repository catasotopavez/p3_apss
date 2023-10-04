import React, { useState, useEffect } from 'react';
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { AUTH_TOKEN} from "./../../constants";
import { useParams } from "react-router-dom";
import "./PostPage.css"

function PostPage() {
  const { tripId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the currently selected image
  const [isZoomed, setIsZoomed] = useState(false); // State to track whether an image is zoomed


  const handleImageClick = (image) => {
    setSelectedImage(image);
    console.log(image.url);
    setIsZoomed(true); // Zoom in when clicking on an image
  };
  
  const handleModalClick = () => {
    setIsZoomed(false); // Zoom out when clicking on the modal
  };
  // Obtén el postId de la URL actual, suponiendo que esté disponible a través de useParams
  // const { postId } = useParams();

  useEffect(() => {
    // Realiza una solicitud al servidor para obtener los detalles del post específico
    fetch(`https://p1apps-production.up.railway.app/api/v1/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Establece los detalles del post en el estado
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setLoading(false);
      });

    // Realiza una solicitud al servidor para obtener las imágenes relacionadas con el post
    fetch(`https://p1apps-production.up.railway.app/api/v1/posts/${postId}/images`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Establece las imágenes en el estado
        setImages(data);      })
      .catch((error) => {
        console.error('Error fetching post images:', error);
      });
  }, [postId]);


 
   
  const handleAddImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => handleImageUpload(e.target.files[0]);

    // Trigger a click event to open the file dialog
    fileInput.click();
  };

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("trip", tripId);
  
    // Send the image to the backend using a fetch request
    fetch(`https://p1apps-production.up.railway.app/api/v1/posts/${postId}/upload_image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the backend, e.g., update the post with the new image
      console.log(data);
      
      // Fetch the updated images data from the server
      fetch(`https://p1apps-production.up.railway.app/api/v1/posts/${postId}/images`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((newImages) => {
        // Update the images state with the new data
        setImages(newImages);
      })
      .catch((error) => {
        console.error('Error fetching updated images:', error);
      });
      
      // Refresh the post data to include the new image
      // You may need to fetch the updated post data from the server
    })
    .catch((error) => {
      console.error("Error uploading image", error);
    });
  };


  return (
    <div className="post-page-container">
      {loading ? (
        <SpinnerOfDoom />
      ) : (
        <div className="post-box">
          {post ? (
            <div className="post-details">
              <h3>Title: {post.title}</h3>
              <p>Body: <br />{post.body}</p>
            </div>
          ) : (
            <p>No se encontró el post.</p>
          )}

          {images.length > 0 ? (
            <div className="image-gallery-container">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={`https://p1apps-production.up.railway.app/${image.url}`}
                  alt="Post Image"
                  className={`gallery-thumbnail ${isZoomed ? 'zoomed' : ''}`}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          ) : (
            <p>No se encontraron imágenes relacionadas.</p>
          )}
          <button onClick={handleAddImage}>Add Image</button>
        </div>
      )}

      {selectedImage && (
        <div
          className={`image-gallery-modal ${isZoomed ? 'zoomed' : ''}`}
          onClick={handleModalClick}
        >
          <div className="modal-content">
            <span className="close" onClick={handleModalClick}>
              &times;
            </span>
            <img
              src={`https://p1apps-production.up.railway.app/${selectedImage.url}`}
              alt="Post Image"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PostPage;
