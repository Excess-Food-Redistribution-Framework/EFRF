import React, { useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

function ProfilePage() {
  const [userData, setUserData] = React.useState(null);

  const { isAuth } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/Account');
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    isAuth() && fetchUserData();
  }, []);

  return (
    <Container>
      <h1>Profile</h1>
      {isAuth() ? (
        <>
          {userData ? (
            <>
              <p>
                Id:
                {/* @ts-ignore */}
                {userData.id}
              </p>
              {/* @ts-ignore */}
              <p>
                Username:
                {/* @ts-ignore */}
                {userData.userName}
              </p>
              {/* @ts-ignore */}
              <p>
                Email:
                {/* @ts-ignore */}
                {userData.email}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </>
      ) : (
        <p>To show your profile, please login</p>
      )}
    </Container>
  );
}

export default ProfilePage;
