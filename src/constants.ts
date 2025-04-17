
export const UPI_PROVIDERS = [
  { id: 'gpay', name: 'Google Pay', iconBg: 'bg-blue-600' },
  { id: 'phonepe', name: 'PhonePe', iconBg: 'bg-indigo-600' },
  { id: 'paytm', name: 'Paytm', iconBg: 'bg-blue-900' },
  { id: 'bhim', name: 'BHIM UPI', iconBg: 'bg-green-700' }
];

export const BNPL_PROVIDERS = [
  { id: 'simpl', name: 'Simpl', iconBg: 'bg-purple-600' },
  { id: 'lazypay', name: 'LazyPay', iconBg: 'bg-yellow-600' },
  { id: 'zestmoney', name: 'ZestMoney', iconBg: 'bg-red-600' },
  { id: 'sezzle', name: 'Sezzle', iconBg: 'bg-green-600' }
];

export const VALID_COUPONS = [
  { code: 'WELCOME10', type: 'percent', discount: 10, maxDiscount: 100 },
  { code: 'FLAT50', type: 'fixed', discount: 50 },
  { code: 'ZEPMEDS20', type: 'percent', discount: 20, maxDiscount: 200 }
];
