import { Routes, Route, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AuthProvider from './AuthProvider';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile.tsx';
import RegistrationPage from './pages/RegistrationPage';
import Blog from './pages/Blog';
import Products from './pages/Products';
import ArticleDetail from './pages/ArticleDetail';
import OrganizationFormPage from './pages/OrganizationFormPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductDetailPage from './pages/ProductDetail';
import ProductUpdateFormPage from './pages/ProductUpdateFormPage';
import OrganizationProducts from './pages/OrganizationProducts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Set axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL as string;
  axios.defaults.timeout = 2000;

  return (
    <BrowserRouter>
      <AuthProvider>
      <ToastContainer />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:articleId" element={<ArticleDetail />} />
            <Route path="/products/:productId" element={<ProductDetailPage />}/>
            <Route path="/products/:productId/update" element={<ProductUpdateFormPage />}/>
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/organization/create" element={<OrganizationFormPage />}/>
            <Route path="/product/create" element={<ProductFormPage />} />
            <Route path="/organizationProducts" element={<OrganizationProducts />} />
            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
