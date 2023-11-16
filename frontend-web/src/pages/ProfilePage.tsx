import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

function ProfilePage() {
  const [userData, setUserData] = useState<object|any>({});
  const [loading, setLoading] = useState(true);

  const { isAuth } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('api/Account');

      setUserData(response.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth()) {
      fetchUserData();
    }
  }, [isAuth]);

  return (
    <Container>
      <h1>Profile</h1>
      {isAuth() ? (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : userData ? (
            <>
              <p>
                Id: {/* @ts-ignore */} {userData.id}
              </p>
              <p>
                FirstName: {/* @ts-ignore */} {userData.firstName}
              </p>
              <p>
                LastName: {/* @ts-ignore */} {userData.lastName}
              </p>
              <p>
                Email: {/* @ts-ignore */} {userData.email}
              </p>
              <p>
                Data: {/* @ts-ignore */} {JSON.stringify(userData)}
              </p>
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
