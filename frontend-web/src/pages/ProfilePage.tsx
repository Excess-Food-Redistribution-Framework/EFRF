import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';
import MapContainer from '../components/MapContainer';

function ProfilePage() {
  const [userData, setUserData] = useState<object | any>({});
  const [loading, setLoading] = useState(true);

  const { isAuth } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('api/Account');
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuth()) {
        await fetchUserData();
      }
    };

    fetchData();
  }, [isAuth]);

  return (
    <Container>
      <h1>Profile</h1>
      {isAuth() ? (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : userData.id ? (
            <>
              <p>
                Id: {userData.id}
              </p>
              <p>
                FirstName: {userData.firstName}
              </p>
              <p>
                LastName: {userData.lastName}
              </p>
              <p>
                Email: {userData.email}
              </p>
              <p>
                Data: {JSON.stringify(userData.organization.location)}
              </p>
              {userData.organization && userData.organization.location && (
                <MapContainer location={userData.organization.location} />
              )}
            </>
          ) : (
            <p>No data available</p>
          )}
        </>
      ) : (
        <p>To view your profile, please log in</p>
      )}
    </Container>
  );
}

export default ProfilePage;
