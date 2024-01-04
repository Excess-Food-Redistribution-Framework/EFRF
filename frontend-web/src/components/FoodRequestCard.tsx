import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FoodRequestResponse, setState, FoodRequestState } from '../types/foodRequestTypes';
import FoodRequestDetailsModal from './FoodRequestDetailsModal';
import axios from 'axios';

interface FoodRequestCardProps {
  foodRequest: FoodRequestResponse;
}

const FoodRequestCard: React.FC<FoodRequestCardProps> = ({ foodRequest }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const formattedDate = new Date(foodRequest.estPickUpTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
  <div className="food-request-card-container">
      <Card className="food-request-card custom-shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="food-request-card-title primary-color">{foodRequest.title}</h2>
            <h3>{foodRequest.state}</h3>
          </div>
          <p className="food-request-card-description">{foodRequest.description}</p>
          <span className="text-muted">{formattedDate}</span>
          <br />
          <br />
          <div className="d-flex justify-content-end">
    <Button variant="primary" onClick={handleViewDetails}>
      View Details
    </Button>
  </div>
        </Card.Body>
      </Card>
      <FoodRequestDetailsModal
        showModal={showDetailsModal}
        closeModal={handleCloseDetailsModal}
        foodRequest={foodRequest}
      />
    </div>
  );
};

export default FoodRequestCard;
