import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useHRJobs() {
  const { user } = useAuth();
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setJobs(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  async function createJob(fields) {
    const { data, error: err } = await supabase
      .from('jobs')
      .insert({ ...fields, created_by: user.id })
      .select()
      .single();
    if (err) throw err;
    setJobs((prev) => [data, ...prev]);
    return data;
  }

  async function updateJob(id, fields) {
    const { data, error: err } = await supabase
      .from('jobs')
      .update(fields)
      .eq('id', id)
      .eq('created_by', user.id)
      .select()
      .single();
    if (err) throw err;
    setJobs((prev) => prev.map((j) => (j.id === id ? data : j)));
    return data;
  }

  async function deleteJob(id) {
    const { error: err } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id);
    if (err) throw err;
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  async function toggleActive(id, current) {
    return updateJob(id, { is_active: !current });
  }

  const stats = {
    total:        jobs.length,
    active:       jobs.filter((j) => j.is_active).length,
    inactive:     jobs.filter((j) => !j.is_active).length,
    totalViews:   jobs.reduce((s, j) => s + (j.views_count ?? 0), 0),
    totalApps:    jobs.reduce((s, j) => s + (j.applications_count ?? 0), 0),
  };

  return { jobs, loading, error, stats, createJob, updateJob, deleteJob, toggleActive, refetch: fetch };
}
