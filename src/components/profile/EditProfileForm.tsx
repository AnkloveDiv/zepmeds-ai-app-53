
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }).optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const EditProfileForm = ({ onSave, onCancel }: EditProfileFormProps) => {
  const { user, completeProfile } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: "",
      address: user?.address || "",
      dateOfBirth: "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    completeProfile(data.name, data.address || "");
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "default",
    });
    
    onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <div className="flex items-center">
                <User className="h-5 w-5 text-zepmeds-purple mr-2" />
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-black/20 border-white/10" 
                    placeholder="Your full name"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-zepmeds-purple mr-2" />
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    className="bg-black/20 border-white/10" 
                    placeholder="Your email address"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Date of Birth</FormLabel>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-zepmeds-purple mr-2" />
                <FormControl>
                  <Input 
                    {...field} 
                    type="date"
                    className="bg-black/20 border-white/10"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label className="text-white" htmlFor="phone">Phone Number</Label>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-zepmeds-purple mr-2" />
            <Input 
              id="phone"
              value={user?.phoneNumber || ""}
              className="bg-black/20 border-white/10" 
              placeholder="Your phone number" 
              readOnly 
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Address</FormLabel>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-zepmeds-purple mr-2 self-start mt-3" />
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="bg-black/20 border-white/10" 
                    placeholder="Your address"
                    rows={3}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-2">
          <Button 
            type="submit" 
            className="flex-1 bg-zepmeds-purple hover:bg-zepmeds-purple/90"
          >
            <Check className="mr-1" size={16} />
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 border-white/10 text-white hover:bg-white/5"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
