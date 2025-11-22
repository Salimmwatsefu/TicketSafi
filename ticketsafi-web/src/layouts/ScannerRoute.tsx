import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ScannerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
    );
  }

  // Strict Check: Only ORGANIZER or SCANNER roles allowed
  if (!user || !['ORGANIZER', 'SCANNER'].includes(user.role || '')) {
    // Kick them to home or login if unauthorized
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ScannerRoute;