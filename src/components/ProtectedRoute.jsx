import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;