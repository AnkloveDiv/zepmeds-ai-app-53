
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, X, Navigation } from 'lucide-react';
import { getCurrentPosition } from '@/utils/openLayersLoader';

// Define the form validation schema
const formSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  amount: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, { message: "Amount must be positive" })
  ),
  prescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MedicineItem {
  name: string;
  quantity: number;
  price: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const OrderForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([]);
  const [newMedicineName, setNewMedicineName] = useState('');
  const [newMedicineQuantity, setNewMedicineQuantity] = useState(1);
  const [newMedicinePrice, setNewMedicinePrice] = useState(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      prescription: '',
    },
  });

  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      toast({
        title: "Getting location",
        description: "Please allow location access if prompted."
      });
      
      const position = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      
      setLocation(locationData);
      toast({
        title: "Location acquired",
        description: "Your current location has been detected."
      });
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location error",
        description: "Could not get your location. Please try again or proceed without it.",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Try to get location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  const addMedicineItem = () => {
    if (!newMedicineName) {
      toast({
        title: "Error",
        description: "Medicine name is required",
        variant: "destructive",
      });
      return;
    }

    const newItem: MedicineItem = {
      name: newMedicineName,
      quantity: newMedicineQuantity,
      price: newMedicinePrice
    };

    setMedicineItems([...medicineItems, newItem]);
    setNewMedicineName('');
    setNewMedicineQuantity(1);
    setNewMedicinePrice(0);
    
    // Update total amount
    const totalAmount = medicineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (newMedicinePrice * newMedicineQuantity);
    form.setValue('amount', totalAmount);
  };

  const removeMedicineItem = (index: number) => {
    const updatedItems = [...medicineItems];
    updatedItems.splice(index, 1);
    setMedicineItems(updatedItems);
    
    // Update total amount
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    form.setValue('amount', totalAmount);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // Generate a unique order ID
      const orderId = generateOrderId();
      
      // Create the order record with medicines as JSON and location data
      const orderData = {
        order_id: orderId,
        customer: data.customerName,
        date: data.date,
        amount: data.amount,
        setup_prescription: data.prescription || null,
        action: "View Details",
        items: JSON.stringify(medicineItems),
        location: location ? JSON.stringify(location) : null
      };
      
      console.log('Creating order in Supabase:', orderData);
      
      const { data: responseData, error } = await supabase
        .from('orders_new')
        .insert(orderData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Order Placed Successfully",
      });
      
      console.log('Order created:', responseData);
      
      // Reset form
      form.reset({
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        prescription: '',
      });
      
      // Reset medicine items
      setMedicineItems([]);
      
    } catch (err) {
      console.error('Error creating order:', err);
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Order</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter customer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Location Information */}
          <div className="border p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Location</h3>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={getLocation}
                disabled={isGettingLocation}
                className="flex items-center gap-1"
              >
                {isGettingLocation ? "Getting..." : "Get Location"} 
                <Navigation size={16} className="ml-1" />
              </Button>
            </div>
            
            {location ? (
              <div className="text-sm text-gray-700">
                <p>Latitude: {location.latitude.toFixed(6)}</p>
                <p>Longitude: {location.longitude.toFixed(6)}</p>
                {location.accuracy && <p>Accuracy: ±{location.accuracy.toFixed(1)}m</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No location detected yet.</p>
            )}
          </div>
          
          {/* Medicine Items Section */}
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Medicine Items</h3>
            
            {medicineItems.length > 0 && (
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicineItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeMedicineItem(index)}
                        >
                          <X size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="grid grid-cols-4 gap-2 mb-4">
              <Input 
                placeholder="Medicine name" 
                value={newMedicineName}
                onChange={e => setNewMedicineName(e.target.value)}
                className="col-span-2"
              />
              <Input 
                type="number" 
                placeholder="Qty" 
                min="1"
                value={newMedicineQuantity}
                onChange={e => setNewMedicineQuantity(parseInt(e.target.value) || 1)}
              />
              <Input 
                type="number" 
                placeholder="Price" 
                min="0" 
                step="0.01"
                value={newMedicinePrice}
                onChange={e => setNewMedicinePrice(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addMedicineItem} 
              className="w-full"
            >
              <Plus size={16} className="mr-2" /> Add Medicine
            </Button>
          </div>
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="prescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescription</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter prescription details (optional)"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Submit Order"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
