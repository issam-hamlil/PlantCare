import { useState, useEffect } from 'react';
import api, { USE_MOCK_DATA } from '../services/api';

const TestConnection = () => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      // If using mock data, show a mock success message
      if (USE_MOCK_DATA) {
        setMessage('Mock API connection successful');
        return;
      }

      try {
        const response = await api.get('/test');
        setMessage(response.data.message);
      } catch (err: any) {
        setError('Connection failed: ' + (err.response?.statusText || err.message));
        console.error('API connection error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default TestConnection;