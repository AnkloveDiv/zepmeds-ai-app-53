
import React from 'react';
import OrderForm from '../components/OrderForm';
import { useBackNavigation } from '../hooks/useBackNavigation';

const NewOrder = () => {
  const { ExitConfirmDialog } = useBackNavigation('/dashboard');
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">New Order</h1>
        <OrderForm />
      </div>
      <ExitConfirmDialog />
    </div>
  );
};

export default NewOrder;
