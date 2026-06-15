import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session,  setSession]  = useState(null);
  const [user,     setUser]     = useState(null);
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Auth actions ─────────────────────────────────────────────────────────────

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (data) setProfile(data);
    return { data, error };
  };

  const changePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const upgradeToPremium = async (paypalOrderId) => {
    if (!user) return { error: new Error('Not authenticated') };

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const [paymentResult, profileResult] = await Promise.all([
      supabase.from('payments').insert({
        user_id:         user.id,
        paypal_order_id: paypalOrderId,
        amount_usd:      53.07,
        amount_sar:      199,
        status:          'completed',
        plan:            'professional',
        period_months:   1,
      }),
      supabase
        .from('profiles')
        .update({
          plan:            'professional',
          plan_expires_at: expiresAt.toISOString(),
          updated_at:      new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single(),
    ]);

    if (profileResult.data) setProfile(profileResult.data);
    return { error: paymentResult.error || profileResult.error };
  };

  const isPremium = () => {
    if (!profile) return false;
    if (profile.plan !== 'professional') return false;
    if (profile.plan_expires_at && new Date(profile.plan_expires_at) < new Date()) return false;
    return true;
  };

  // ── Avatar helper ─────────────────────────────────────────────────────────────
  const getAvatarUrl = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    const name = profile?.full_name || user?.email?.split('@')[0] || 'U';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=006C35&color=fff&size=80&bold=true`;
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updateProfile,
      changePassword,
      resetPassword,
      upgradeToPremium,
      isPremium,
      getAvatarUrl,
      refreshProfile: () => user && fetchProfile(user.id),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
