import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ isAllowed, children }) {
  const location = useLocation();
  if (!isAllowed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
