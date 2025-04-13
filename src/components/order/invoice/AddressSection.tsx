
import React from 'react';

interface AddressSectionProps {
  customerName: string;
  customerAddress: string;
}

const AddressSection = ({ customerName, customerAddress }: AddressSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <h3 className="font-bold mb-2">Sold By:</h3>
        <p className="text-sm">ZepMeds India Private Limited</p>
        <p className="text-sm">Sy No. 524/1,2,3,4,6, 525/1,2,3,4,5,6</p>
        <p className="text-sm">526/3,4,5,6,527 of madivala village and</p>
        <p className="text-sm">Sy no 51/1 of thatanahhalli village</p>
        <p className="text-sm">Bengaluru urban district</p>
        <p className="text-sm">Bengaluru, Karnataka, 560001</p>
        <p className="text-sm">IN</p>
      </div>
      <div>
        <div className="mb-4">
          <h3 className="font-bold mb-2">Billing Address:</h3>
          <p className="text-sm">{customerName}</p>
          <p className="text-sm">{customerAddress}</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Shipping Address:</h3>
          <p className="text-sm">{customerAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
