
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDataPayload {
  orderId: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export interface OrderCreatePayload {
  items: any[];
  totalAmount: number;
  deliveryAddressId: string;
  prescriptionUrl?: string;
  paymentMethod: string;
}
