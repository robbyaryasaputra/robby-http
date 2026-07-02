import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from public.users
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Fetch profile to get role
    const userProfile = await fetchProfile(data.user.id);

    // Check if user is active
    if (userProfile && userProfile.status !== "active") {
      await supabase.auth.signOut();
      throw new Error(
        "Akun Anda tidak aktif atau dibanned. Silakan hubungi admin."
      );
    }

    return { user: data.user, profile: userProfile };
  };

  // Sign up with email, password, and metadata
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // { name, role, etc. } — used by trigger
      },
    });
    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
  };

  // Refresh profile data (useful after point changes, etc.)
  const refreshProfile = async () => {
    if (session?.user) {
      return await fetchProfile(session.user.id);
    }
    return null;
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
