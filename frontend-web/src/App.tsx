import { Routes, Route, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AuthProvider from './AuthProvider';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import Blog from './pages/Blog';
import Products from './pages/Products';
import ArticleDetail from './pages/ArticleDetail';
import OrganizationFormPage from './pages/OrganizationFormPage';
import ProductFormPage from './pages/ProductFormPage';

function App() {
  // Set axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL as string;
  axios.defaults.timeout = 2000;

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:articleId" element={<ArticleDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route
              path="/organization/create"
              element={<OrganizationFormPage />}
            />
            <Route path="/product/create" element={<ProductFormPage />} />

            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
