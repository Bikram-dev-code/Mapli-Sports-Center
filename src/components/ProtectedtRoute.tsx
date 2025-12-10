// components/ProtectedRoute.jsx (You'll need to create this file)

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
const ProtectedRoute = ({ children, isProtected, redirectTo = "/auth" }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Check for the existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Set up a listener for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Clean up the subscription on component unmount
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    // Show a loading spinner or screen while checking auth status
    return <div>Loading authentication...</div>;
  }

  if (isProtected) {
    // Logic for routes that REQUIRE a login (like your Index page)
    return session ? children : <Navigate to={redirectTo} replace />;
  } else {
    // Logic for routes that should NOT be accessed if logged in (like your Auth page)
    return session ? <Navigate to="/" replace /> : children;
  }
};

export default ProtectedRoute;