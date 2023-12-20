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
import OrganizationForm from './pages/OrganizationForm.tsx';
import ProductFormPage from './pages/ProductFormPage';
import ProductDetailPage from './pages/ProductDetail';
import ProductUpdateFormPage from './pages/ProductUpdateFormPage';
import OrganizationProducts from './pages/OrganizationProducts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from "./pages/ChangePassword.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import FoodRequestForm from './pages/FoodRequestForm.tsx';
import OrganizationFoodRequests from './pages/OrganizationFoodRequests.tsx';
import ContactForm from "./pages/ContactForm.tsx";

function App() {
  // Set axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL as string;
  axios.defaults.timeout = 5000;

  return (
    <BrowserRouter>
      <AuthProvider>
      <ToastContainer />
        <Routes>
          <Route element={<Layout />}>
            {/*Home*/}
            <Route path="/" element={<HomePage />} />

            {/*Blog*/}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:articleId" element={<ArticleDetail />} />

            {/*Products*/}
            <Route path="/products/:productId" element={<ProductDetailPage />}/>
            <Route path="/products/:productId/update" element={<ProductUpdateFormPage />}/>
            <Route path="/products" element={<Products />} />

            {/*Profile*/}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/change-password" element={<ChangePassword />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/product/create" element={<ProductFormPage />} />

            {/*Food Request*/}
            <Route path="/foodRequest/products/:productId" element={<FoodRequestForm />} />

            {/*Auth*/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />

            {/*Organization*/}
            <Route path="/organization/edit" element={<OrganizationForm />}/>
            <Route path="/organizationProducts" element={<OrganizationProducts />} />
            <Route path="/organizationFoodRequests" element={<OrganizationFoodRequests />} />

            {/*Contact*/}
            <Route path="/contact" element={<ContactForm />} />

            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
