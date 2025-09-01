import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Helper function for API calls to our edge function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2095e8d8`;
  const fullUrl = `${baseUrl}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  const requestConfig = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log(`Making API call to: ${fullUrl}`, {
    method: requestConfig.method || 'GET',
    headers: requestConfig.headers,
    body: requestConfig.body ? JSON.parse(requestConfig.body as string) : undefined
  });

  try {
    const response = await fetch(fullUrl, requestConfig);

    console.log(`API response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response:`, errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const jsonResponse = await response.json();
    console.log(`API response data:`, jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};