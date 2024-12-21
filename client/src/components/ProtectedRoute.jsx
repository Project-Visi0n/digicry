import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthticated }) => {
  if (!isAuthticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
