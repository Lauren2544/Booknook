import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check`, { withCredentials: true })
      .then(() => {
        setAuthorized(true);
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, []);

  // if loading just wait 
  if (loading) return <div></div>;

  return authorized ? children : navigate('/login');
}
