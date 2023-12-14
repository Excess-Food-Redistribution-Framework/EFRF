import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { DeliveryType, FoodRequest } from '../types/foodRequestTypes';
import { GetProductById } from '../hooks/useProduct';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { toast } from 'react-toastify';
import ProductCards from '../components/ProductCards';
import '../styles/FoodRequestStyle.css';

function FoodRequestPage() {
  const { isAuth, user, userRole } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const id: string = productId || '';
  const { product, errorMessage } = GetProductById(id);
  const [organization, setOrganization] = useState<OrganizationApiResponse>();
  const [userData, setUserData] = useState<object | any>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estPickUpTime, setEstPickUpTime] = useState('');
  const [delivery, setDelivery] = useState(DeliveryType.ProviderCanDeliver);
  const [organizationId, setOrganizationId] = useState('');
  const [foodRequest, setFoodRequest] = useState<FoodRequest>();
  const [organizationProducts, setOrganizationProducts] = useState<any[]>([]);
  const page = 1;
  const pageSize = 5;
  const [showDisabled, setShowDisabled] = useState<boolean>(true);
  const isPagination = true;
  const pageSizeMap = 100000;

  useEffect(() => {
    const fetchData = async () => {
      if (isAuth()) {
        try {
          const response = await axios.get('api/Account');
          setUserData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [isAuth]);


  useEffect(() => {
    const fetchOrganizationProducts = async () => {
      try {
        const response = await axios.get(``);
        setOrganizationProducts(response.data);
      } catch (error) {
        console.error('Error fetching organization products:', error);
      }
    };

    if (organizationId) {
      fetchOrganizationProducts();
    }
  }, [organizationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationId) {
      console.error('Organization ID is missing or invalid.');
      return;
    }

    try {
      const response = await axios.post('api/FoodRequest', {
        title,
        description,
        estPickUpTime,
        delivery,
        organizationId,
      });

      setFoodRequest(response.data);
      navigate('/organizationProducts');
      toast.success('Food request created successfully!');
    } catch (error) {
      console.error('Error while creating food request:', error);
    }
  };

  return (
    <div className="food-request-container">
      <div className="sidebar">
        <h2>Selected Product</h2>
        {foodRequest && (
          <div>
            <p>Title: {foodRequest.title}</p>
            <p>Description: {foodRequest.description}</p>
            <p>Estimated Pick Up Time: {foodRequest.estPickUpTime}</p>
            <p>Delivery: {foodRequest.delivery}</p>
          </div>
        )}
      </div>
      <div className="main-content">
        <h1>Food Request</h1>
        <form onSubmit={handleSubmit}>
        <label>
          Title:
          <br />
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <br />
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Estimated Pick Up Time:
          <br />
          <input
            type="datetime-local"
            name="estPickUpTime"
            value={estPickUpTime}
            onChange={(e) => setEstPickUpTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          Delivery:
          <select
            name="delivery"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value as DeliveryType)}
          >
            <option value={DeliveryType.ProviderCanDeliver}>Provider Can Deliver</option>
            <option value={DeliveryType.DistributorNeedsToTakeAway}>Distributor Needs To Take Away</option>
            <option value={DeliveryType.Use3rdPartyDeliveryService}>Use 3rd Party Delivery Service</option>
          </select>
        </label>
        <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="other-products">
        <h2>Other Products from the Same Organization</h2>
        <div className="product-cards-container">
        
      <ProductCards
        params={{
        page,
        pageSize,
        organizationIds: product?.organization?.id,
        notExpired: showDisabled,
      }}
      pagination={isPagination}
    />
        </div>
      </div>
    </div>
  );
}

export default FoodRequestPage;
