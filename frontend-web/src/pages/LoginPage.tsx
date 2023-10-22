import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

interface ILoginRequest {
  userName: string;
  password: string;
}

interface ILoginResponse {
  token: string;
}

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { setToken, isLogged } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post<ILoginResponse>('api/Account/Login', {
        userName: username,
        password,
      } as ILoginRequest);

      setToken(response.data.token);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLogged()) {
      navigate('/');
    }
  });

  return (
    <Container>
      <h1>Login</h1>
      <div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Login;
