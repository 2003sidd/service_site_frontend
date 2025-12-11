import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/UI/Loader';

// Lazy loaded components
const Layout = React.lazy(() => import('./components/Layout/Layout'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Users = React.lazy(() => import('./pages/Users'));
const Employees = React.lazy(() => import('./pages/Employees'));
const Services = React.lazy(() => import('./pages/Services'));
const PageNotFound = React.lazy(() => import('./pages/PageNotFound'));
const NewServices = React.lazy(() => import('./pages/NewServiceRequest'));
const ServicesRequest = React.lazy(() => import('./pages/ServiceRequest'));
const ServiceDetail = React.lazy(() => import('./pages/ServiceRequestDetail'));
const Configration = React.lazy(() => import('./pages/Configration'));
const AboutUs = React.lazy(() => import('./pages/aboutus'));


function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="config" element={<Configration />} />
              <Route path="aboutUs" element={<AboutUs />} />
              <Route path="serviceRequestDetail/:id" element={<ServiceDetail />} />
              <Route path="newRequest" element={<NewServices />} />
              <Route path="request" element={<ServicesRequest />} />
              <Route path="users" element={<Users />} />
              <Route path="employees" element={<Employees />} />
              <Route path="services" element={<Services />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
