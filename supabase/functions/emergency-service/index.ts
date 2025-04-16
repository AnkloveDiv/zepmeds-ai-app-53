
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? 'https://selkrzzcwbyyawcuwlpa.supabase.co',
      Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbGtyenpjd2J5eWF3Y3V3bHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODY2OTcsImV4cCI6MjA2MDM2MjY5N30.firDGbV2MsFOj9ZmN8vO2oAztPBQ2m0GBKE7jxtrxKA',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { action, requestId } = await req.json();
    
    // Process different emergency actions
    switch (action) {
      case 'assign-ambulance':
        return await assignAmbulance(supabaseClient, requestId);
      
      case 'update-status':
        const { status } = await req.json();
        return await updateEmergencyStatus(supabaseClient, requestId, status);
        
      case 'get-pending-requests':
        return await getPendingRequests(supabaseClient);
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action specified' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function assignAmbulance(supabaseClient, requestId) {
  console.log(`Attempting to assign ambulance to request: ${requestId}`);
  
  // Get request details
  const { data: emergencyRequest, error: requestError } = await supabaseClient
    .from('emergency_requests')
    .select('*')
    .eq('id', requestId)
    .single();
    
  if (requestError) {
    throw new Error(`Request not found: ${requestError.message}`);
  }
  
  // Find available ambulance
  const { data: availableAmbulances, error: ambulanceError } = await supabaseClient
    .from('ambulances')
    .select('*')
    .eq('status', 'available')
    .limit(1);
    
  if (ambulanceError) {
    throw new Error(`Error finding ambulance: ${ambulanceError.message}`);
  }
  
  if (!availableAmbulances || availableAmbulances.length === 0) {
    // No available ambulances, create a simulated one
    const { data: newAmbulance, error: createError } = await supabaseClient
      .from('ambulances')
      .insert({
        name: 'Emergency Response Unit',
        driver_name: 'John Medic',
        driver_phone: '+911234567890',
        vehicle_number: `ZEP-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'available'
      })
      .select()
      .single();
      
    if (createError) {
      throw new Error(`Could not create ambulance: ${createError.message}`);
    }
    
    availableAmbulances = [newAmbulance];
  }
  
  const selectedAmbulance = availableAmbulances[0];
  
  // Update emergency request with ambulance assignment
  const { data: updatedRequest, error: updateError } = await supabaseClient
    .from('emergency_requests')
    .update({ 
      status: 'dispatched',
      ambulance_id: selectedAmbulance.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();
    
  if (updateError) {
    throw new Error(`Could not update emergency request: ${updateError.message}`);
  }
  
  // Update ambulance status
  await supabaseClient
    .from('ambulances')
    .update({ 
      status: 'dispatched',
      updated_at: new Date().toISOString()
    })
    .eq('id', selectedAmbulance.id);
  
  // Create a report for this emergency
  await supabaseClient
    .from('reports')
    .insert({
      title: `Emergency Response ${requestId}`,
      description: `Emergency response dispatched for ${emergencyRequest.name}`,
      ambulance_id: selectedAmbulance.id,
      emergency_id: requestId
    });

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Ambulance assigned successfully',
      data: updatedRequest
    }),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function updateEmergencyStatus(supabaseClient, requestId, status) {
  console.log(`Updating emergency request ${requestId} status to ${status}`);
  
  const { data, error } = await supabaseClient
    .from('emergency_requests')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Could not update status: ${error.message}`);
  }
  
  // If status is completed or cancelled, also update ambulance status
  if (status === 'completed' || status === 'cancelled') {
    if (data.ambulance_id) {
      await supabaseClient
        .from('ambulances')
        .update({ 
          status: 'available',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.ambulance_id);
    }
    
    // Update report if exists
    const { data: reports } = await supabaseClient
      .from('reports')
      .select('id')
      .eq('emergency_id', requestId);
      
    if (reports && reports.length > 0) {
      await supabaseClient
        .from('reports')
        .update({
          description: `${data.description || 'Emergency response'} - ${status}`,
          updated_at: new Date().toISOString()
        })
        .eq('emergency_id', requestId);
    }
  }
  
  return new Response(
    JSON.stringify({
      success: true,
      message: `Status updated to ${status}`,
      data
    }),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function getPendingRequests(supabaseClient) {
  console.log('Getting pending emergency requests');
  
  const { data, error } = await supabaseClient
    .from('emergency_requests')
    .select('*')
    .in('status', ['pending', 'dispatched'])
    .order('timestamp', { ascending: false });
    
  if (error) {
    throw new Error(`Could not fetch pending requests: ${error.message}`);
  }
  
  return new Response(
    JSON.stringify({
      success: true,
      data
    }),
    { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
