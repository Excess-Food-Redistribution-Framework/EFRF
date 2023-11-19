import { useState, useEffect } from 'react';
import axios from 'axios';
import { OrganizationApiResponse } from '../types/organizationTypes';

const useMap = () => {
  const [organizations, setOrganizations] = useState<OrganizationApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizationData = async () => {
    try {
      const organizationResponse = await axios.get('/api/Organization');
      setOrganizations(organizationResponse.data);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);


  return { organizations, loading };
};



export default useMap;
