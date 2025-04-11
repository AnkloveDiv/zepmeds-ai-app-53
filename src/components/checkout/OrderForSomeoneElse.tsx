
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, MapPin } from "lucide-react";

interface RecipientDetailsProps {
  onChange: (details: RecipientDetails) => void;
}

export interface RecipientDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  landmark?: string;
}

const OrderForSomeoneElse = ({ onChange }: RecipientDetailsProps) => {
  const [orderForOther, setOrderForOther] = useState(false);
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    landmark: ""
  });

  const handleToggleOrderForOther = (checked: boolean) => {
    setOrderForOther(checked);
    if (!checked) {
      // Reset the form when toggling off
      const emptyDetails = {
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        landmark: ""
      };
      setRecipientDetails(emptyDetails);
      onChange(emptyDetails);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedDetails = { ...recipientDetails, [name]: value };
    setRecipientDetails(updatedDetails);
    onChange(updatedDetails);
  };

  return (
    <div className="glass-morphism rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <User className="text-zepmeds-purple mr-2" size={20} />
          <h3 className="text-white font-medium">Order for Someone Else?</h3>
        </div>
        <Switch
          checked={orderForOther}
          onCheckedChange={handleToggleOrderForOther}
        />
      </div>

      {orderForOther && (
        <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input
                id="recipientName"
                name="name"
                value={recipientDetails.name}
                onChange={handleInputChange}
                className="bg-black/20 border-white/10"
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="recipientPhone">Recipient's Phone</Label>
              <Input
                id="recipientPhone"
                name="phone"
                value={recipientDetails.phone}
                onChange={handleInputChange}
                className="bg-black/20 border-white/10"
                placeholder="Contact number"
              />
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-400 mb-2">
            <MapPin className="h-4 w-4 mr-1 text-zepmeds-purple" />
            <span>Recipient's Delivery Address</span>
          </div>
          
          <div>
            <Label htmlFor="recipientAddress">Address</Label>
            <Textarea
              id="recipientAddress"
              name="address"
              value={recipientDetails.address}
              onChange={handleInputChange}
              className="bg-black/20 border-white/10"
              rows={2}
              placeholder="Full address"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientCity">City</Label>
              <Input
                id="recipientCity"
                name="city"
                value={recipientDetails.city}
                onChange={handleInputChange}
                className="bg-black/20 border-white/10"
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="recipientPincode">PIN Code</Label>
              <Input
                id="recipientPincode"
                name="pincode"
                value={recipientDetails.pincode}
                onChange={handleInputChange}
                className="bg-black/20 border-white/10"
                placeholder="PIN code"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="recipientLandmark">Landmark (Optional)</Label>
            <Input
              id="recipientLandmark"
              name="landmark"
              value={recipientDetails.landmark}
              onChange={handleInputChange}
              className="bg-black/20 border-white/10"
              placeholder="Nearest landmark"
            />
          </div>
          
          <p className="text-xs text-gray-400 mt-2">
            * The order will be delivered to this address instead of your saved address
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderForSomeoneElse;
