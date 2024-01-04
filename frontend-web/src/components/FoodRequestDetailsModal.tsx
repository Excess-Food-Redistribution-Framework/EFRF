import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { FoodRequestResponse, FoodRequestState, setState } from '../types/foodRequestTypes';
import ProductRequestCard from './ProductRequestCard';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthProvider';
import axios from 'axios';
import { OrganizationApiResponse } from '../types/organizationTypes';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { DeleteFoodRequest, useFoodRequests, GetFoodRequestById } from '../hooks/useFoodRequest';

interface FoodRequestDetailsModalProps {
  showModal: boolean;
  closeModal: () => void;
  foodRequest: FoodRequestResponse | null;
}

const modalStyle: Modal.Styles = {
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
    maxHeight: '90vh',
    width: '80%',
    maxWidth: '1000px',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
  },
};

const FoodRequestDetailsModal: React.FC<FoodRequestDetailsModalProps> = ({ showModal, closeModal, foodRequest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(FoodRequestState.NotAccepted);
  const [loading, setLoading] = useState(true);
  const [foodReq, setFoodReq] = useState<FoodRequestResponse | undefined>(undefined);
  const [organization, setOrganization] = useState<OrganizationApiResponse | undefined>(undefined);

  useEffect(() => {
    if (foodRequest) {
      setFoodReq(foodRequest);
    }
  }, [foodRequest]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (foodReq) {
          setLoading(false);
        }

        const organizationResponse = await axios.get('/api/Organization/Current');
        setOrganization(organizationResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [foodReq, user]);

  const handleDeleteSuccess = () => {
    toast.success('Food request deleted successfully');
    navigate('/organizationFoodRequests/');
  };

  const handleDeleteError = (error: string) => {
    console.error(`Error deleting food request: ${error}`);
  };

  const handleConfirmDelete = () => {
    if (foodReq) {
      console.log(foodReq.id);
      DeleteFoodRequest(foodReq.id, handleDeleteSuccess, handleDeleteError);
      setShowDeleteModal(false);
    }
  };

  const handleChangeStatus = async (id: string, state: FoodRequestState) => {
    try {
      const changeStateData: setState = {
        id,
        state,
      };

      await axios.post('api/FoodRequest/ChangeState', changeStateData);

      setSelectedStatus(state);
      toast.success(`Food request state changed to ${state}`);
    } catch (error) {
      console.error('Error while changing status:', error);
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Food Request Details</h2>
        <button
          onClick={closeModal}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span role="img" aria-label="close">
            ❌
          </span>
        </button>
      </div>
      {foodReq && (
        <div>
          <p>Title: {foodReq.title}</p>
          <p>Description: {foodReq.description}</p>

          {foodReq.state !== FoodRequestState.Received && (
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as FoodRequestState)}
              >
                {Object.values(FoodRequestState).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button className="primary-button" onClick={() => handleChangeStatus(foodReq.id, selectedStatus)}>
                Change State
              </button>
            </div>
          )}
          <div className="divider"></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {foodReq.productPicks.map((productPick) => (
              <ProductRequestCard
                key={productPick.id}
                params={{
                  page: 1,
                  pageSize: 4,
                  notExpired: true,
                  productIds: productPick.product.id,
                  organizationIds: productPick.product?.organization?.id,
                }}
                isPagination={false}
                isFilter={false}
                quantity={productPick.quantity}
              />
            ))}
          </div>
          <div className="divider"></div>
          {foodReq.state !== FoodRequestState.Received && (
          <div className="button-container">
            <Button variant="danger" className="danger-button" onClick={() => setShowDeleteModal(true)}>
              Delete Request
            </Button>
            <Button variant="primary">Update Request</Button>
          </div>
          )}
        </div>
      )}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </Modal>
  );
};

export default FoodRequestDetailsModal;
