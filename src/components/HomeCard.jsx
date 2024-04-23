import React from 'react';
import './HomeCard.css'; 

function HomeCard() {
  return (
    <div className="cardview">
      <div className="row">
        <div className="card blue"></div>
        <div className="card green"></div>
        <div className="card orange"></div>
      </div>
      <div className="row">
        <div className="card red big"></div>
        <div className="card gray"></div>
      </div>
    </div>
  );
}

export default HomeCard;
