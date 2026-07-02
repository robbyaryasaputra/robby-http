import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../layout/Loading";

/**
 * ProtectedRoute - Route guard component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} [props.allowedRoles] - Roles allowed to access this route (e.g., ['admin', 'cashier'])
 * @param {string} [props.redirectTo] - Redirect path when unauthorized (default: '/auth/login')
 */
export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/auth/login",
}) {
  const { profile, loading, user } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <Loading />;
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Profile not loaded yet or user not found in public.users
  if (!profile) {
    return <Loading />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard/error-403" replace />;
  }

  return children;
}
