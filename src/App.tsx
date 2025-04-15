import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import MedicineDelivery from './pages/MedicineDelivery';
import Support from './pages/Support';
import TrackOrder from './pages/TrackOrder';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Addresses from './pages/Addresses';
import Emergency from './pages/Emergency';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

// Add the AdminDashboard route to the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><MedicineDelivery /></ProtectedRoute>
  },
  {
    path: "/support",
    element: <ProtectedRoute><Support /></ProtectedRoute>
  },
  {
    path: "/track-order/:orderId",
    element: <ProtectedRoute><TrackOrder /></ProtectedRoute>
  },
  {
    path: "/order-tracking",
    element: <ProtectedRoute><OrderTracking /></ProtectedRoute>
  },
  {
    path: "/checkout",
    element: <ProtectedRoute><Checkout /></ProtectedRoute>
  },
  {
    path: "/cart",
    element: <ProtectedRoute><Cart /></ProtectedRoute>
  },
  {
    path: "/addresses",
    element: <ProtectedRoute><Addresses /></ProtectedRoute>
  },
  {
    path: "/emergency",
    element: <ProtectedRoute><Emergency /></ProtectedRoute>
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: "/signup",
    element: <PublicRoute><Signup /></PublicRoute>
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />
  },
]);

export default App;
