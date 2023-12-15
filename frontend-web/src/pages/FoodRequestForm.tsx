import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { AddProductToFoodRequest, DeliveryType, FoodRequestResponse } from '../types/foodRequestTypes';
import { GetProductById, GetListOfProducts } from '../hooks/useProduct';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { toast } from 'react-toastify';
import PickProductCards from '../components/PickProductCards';
import '../styles/FoodRequestStyle.css';

function FoodRequestPage(params: any) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const id: string = productId || '';
  const { product, errorMessage } = GetProductById(id);
  const [userData, setUserData] = useState<object | any>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estPickUpTime, setEstPickUpTime] = useState('');
  const [delivery, setDelivery] = useState(DeliveryType.ProviderCanDeliver);
  const [organizationProducts, setOrganizationProducts] = useState<any[]>([]);
  const [testProducts, setTestProducts] = useState<any[]>([]);
  const page = 1;
  const pageSize = 5;
  const [showDisabled, setShowDisabled] = useState<boolean>(true);
  const [props, setProps] = useState(params);

  const { response, errorMessage: productsErrorMessage } = GetListOfProducts(props);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prevProducts) => {
      if (prevProducts.includes(productId)) {
        setOrganizationProducts((prevOrgProducts) => [...prevOrgProducts, productId]);
        return prevProducts.filter((id) => id !== productId);
      } else {
        setOrganizationProducts((prevOrgProducts) =>
          prevOrgProducts.filter((id) => id !== productId)
        );
        return [...prevProducts, productId];
      }
    });
  };

  const handleSliderChange = (productId: string, quantity: number) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

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
    if (response && response.data) {
      setTestProducts(response.data);
      setSelectedProducts(product?.id ? [product.id] : []);
      setOrganizationProducts(() => {
        const newOrganizationProducts = [];
    
        for (const orgProducts of response.data) {
          if (orgProducts.organization.id === product?.organization.id && orgProducts.id !== product?.id) {
            newOrganizationProducts.push(orgProducts.id);
          }
        }
    
        return newOrganizationProducts;
      });
    }
  }, [isAuth, response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createFoodRequestResponse = await axios.post('api/FoodRequest', {
        title,
        description,
        estPickUpTime,
        delivery,
        organizationId: product?.organization.id,
      });

      const foodRequestId = createFoodRequestResponse.data.id;

      for (const productId of selectedProducts) {
        const addProductData: AddProductToFoodRequest = {
          productId,
          foodRequestId,
          quantity: selectedQuantities[productId] || 1,
        };

        await axios.put('api/FoodRequest/AddProduct', addProductData);
      }
      navigate('/organizationFoodRequests');
      toast.success('Food request created successfully!');
    } catch (error) {
      console.error('Error while creating food request:', error);
    }
  };

  return (
    <div className="food-request-container">
      <div className="sidebar">
        <h2>Selected Product</h2>
        <div className="product-cards-container">
        {selectedProducts.map((productId) => (
            <PickProductCards
              key={productId}
              params={{
                page,
                pageSize,
                productIds: productId,
                notExpired: showDisabled,
              }}
              pagination={false}
              onToggleProduct={handleToggleProduct}
              onQuantityChange={handleSliderChange}
              buttonText="Remove"
            />
          ))}
      </div>
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
  {organizationProducts.map((productId) => (
    <PickProductCards
      key={productId}
      params={{
        page,
        pageSize,
        productIds: productId,
        organizationIds: product?.organization.id,
        notExpired: !showDisabled,
      }}
      pagination={false}
      onToggleProduct={handleToggleProduct}
      onQuantityChange={handleSliderChange}
      buttonText="Add to Cart"
    />
  ))}

          
        </div>
      </div>
    </div>
  );
}

export default FoodRequestPage;
