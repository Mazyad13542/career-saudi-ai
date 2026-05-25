import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const addApplication = async (app) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('applications')
      .insert({ ...app, user_id: user.id })
      .select()
      .single();
    if (data) setApplications((prev) => [data, ...prev]);
    return { data, error };
  };

  const updateStatus = async (id, status) => {
    const { data } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setApplications((prev) => prev.map((a) => (a.id === id ? data : a)));
  };

  const deleteApplication = async (id) => {
    await supabase.from('applications').delete().eq('id', id).eq('user_id', user.id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const stats = {
    total:     applications.length,
    pending:   applications.filter((a) => a.status === 'Pending').length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    offer:     applications.filter((a) => a.status === 'Offer').length,
    rejected:  applications.filter((a) => a.status === 'Rejected').length,
  };

  return {
    applications, loading, stats,
    addApplication, updateStatus, deleteApplication,
    refetch: fetchApplications,
  };
}
