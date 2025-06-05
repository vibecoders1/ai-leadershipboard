
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};
