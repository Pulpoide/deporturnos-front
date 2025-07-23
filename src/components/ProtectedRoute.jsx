import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.roles[0];
  }
  return null;
};


const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    if (!userRole || userRole !== role) {
      navigate('/login');
    }
  }, [userRole, role, navigate]);

  if (userRole === role) {
    return children;
  } else {
    return null; 
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired,
};

export default ProtectedRoute;
