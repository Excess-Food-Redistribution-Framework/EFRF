import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FoodRequestResponse } from '../types/foodRequestTypes';
import FoodRequestDetailsModal from './FoodRequestDetailsModal';
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
    <div>
    <Card className="my-3">
      <Card.Body>
        <Card.Title>{foodRequest.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Est. Pick-Up Time: {formattedDate}
        </Card.Subtitle>
        <Card.Text>{foodRequest.description}</Card.Text>
        <div className="d-flex justify-content-end mt-3">
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
