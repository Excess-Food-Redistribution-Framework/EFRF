import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { FoodRequestResponse } from '../types/foodRequestTypes';
import ProductCards from './ProductCards';

interface FoodRequestDetailsModalProps {
  showModal: boolean;
  closeModal: () => void;
  foodRequest: FoodRequestResponse | null;
}

const modalStyle: ReactModal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minHeight: '300px',
    maxHeight: '100vh',
    width: '80%',
    maxWidth: '1300px',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
  },
};

const FoodRequestDetailsModal: React.FC<FoodRequestDetailsModalProps> = ({ showModal, closeModal, foodRequest }) => {
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      style={modalStyle}
      contentLabel="Food Request Details Modal"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Food Request Details</h2>
        <Button variant="link" onClick={closeModal} style={{ cursor: 'pointer' }}>
          Close
        </Button>
      </div>
      {foodRequest && (
        <div>
          <p>Title: {foodRequest.title}</p>
          <p>Description: {foodRequest.description}</p>
          <h3>Products:</h3>
          {foodRequest.productPicks.map((productPick) => (
            <div key={productPick.id}>
              <ProductCards
        params={{
          page: 1,
          pageSize: 4,
          notExpired: true,
          productIds: productPick.product.id,
          organizationIds: productPick.product?.organization?.id,
        }}
        pagination={false}
      />
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default FoodRequestDetailsModal;