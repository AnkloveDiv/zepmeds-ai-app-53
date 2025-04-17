
import { supabase } from '@/integrations/supabase/client';

export const uploadPrescription = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('prescriptions')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading prescription:', error);
    throw error;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('prescriptions')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const isPrescriptionRequired = (cartItems: any[]): boolean => {
  return cartItems.some(item => item.prescription_required === true);
};
