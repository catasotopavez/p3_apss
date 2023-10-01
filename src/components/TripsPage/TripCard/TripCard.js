import React from "react";
import './TripCard.css';
import { Link } from "react-router-dom";
import {Button, Chip, Container} from "@mui/material";
import placeholder from "./placeholder.png";
import TripPage from "../../TripPage";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function TripCard({ trip }) {
    const myImageStyle = { width: '75%', objectFit: 'contain' };
    const navigate = useNavigate();
    let chipColor;
    let chipText;
    let today = new Date();
    let start = new Date(trip.startDate);
    let end = new Date(trip.endDate);
    

    const handleClick = () => {
      navigate(`/trip/${trip.id}`);
    };
  
    // Debug statements
    console.log('Trip data:', trip);
    console.log('Today:', today);
    console.log('Start date:', start);
    console.log('End date:', end);
  
    if (end > today && end < today) {
      chipColor = "info";
      chipText = "Ongoing";
    } else if (end > today) {
      chipColor = "warning";
      chipText = "Upcoming";
    } else {
      chipColor = "error";
      chipText = "Ended";
    }


 
    return (
      <Container sx={{ pt: 2 }}>
        <div className="trip-card">
          <div className="trip-card__image">
            <img style={myImageStyle} src={trip.imageSrc || placeholder} alt={'placeholder'} />
          </div>
          <div className="trip-card__content">
            <h3 className="TitleStyle">{trip?.name}</h3>
            <p className="SubtitleStyle">
              {format(new Date(trip?.startDate), 'MMMM dd, yyyy')} - {format(new Date(trip?.endDate), 'MMMM dd, yyyy')}
            </p>
            <div style= {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip className={"Chip"} label={chipText} color={chipColor} style= {{alignItems: 'center', justifyContent: 'center', padding: '8px'}}/>
            <button style = {{float: 'right'}} onClick= {handleClick}>View more</button>
            </div>
            
          </div>
        </div>
      </Container>
    );
  }
  
export default TripCard;
