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
    body: requestConfig.body ? (typeof requestConfig.body === 'string' ? JSON.parse(requestConfig.body) : requestConfig.body) : undefined
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

// Test function to check if backend is working
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await apiCall('/health');
    console.log('Backend test successful:', response);
    return true;
  } catch (error) {
    console.error('Backend test failed:', error);
    return false;
  }
};