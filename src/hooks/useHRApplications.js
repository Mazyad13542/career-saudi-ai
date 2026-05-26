import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useHRApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const refetchHRApps = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    // Get job IDs owned by this HR user
    const { data: jobRows, error: jobErr } = await supabase
      .from('jobs')
      .select('id, title, company')
      .eq('created_by', user.id);

    if (jobErr) { setError(jobErr.message); setLoading(false); return; }
    if (!jobRows || jobRows.length === 0) { setApplications([]); setLoading(false); return; }

    const jobIds  = jobRows.map((j) => j.id);
    const jobMap  = Object.fromEntries(jobRows.map((j) => [j.id, j]));

    // Get applications for those jobs
    const { data: apps, error: appErr } = await supabase
      .from('applications')
      .select('*')
      .in('job_id', jobIds)
      .order('applied_at', { ascending: false });

    if (appErr) { setError(appErr.message); setLoading(false); return; }
    if (!apps || apps.length === 0) { setApplications([]); setLoading(false); return; }

    // Get candidate profiles (HR policy allows this)
    const userIds = [...new Set(apps.map((a) => a.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, job_title, city, avatar_url, english_level, career_score, ats_score, skills, experience_years, profile_strength')
      .in('id', userIds);

    const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

    const enriched = apps.map((a) => ({
      ...a,
      job:       jobMap[a.job_id]   ?? null,
      candidate: profileMap[a.user_id] ?? null,
    }));

    setApplications(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => { refetchHRApps(); }, [refetchHRApps]);

  async function updateStatus(appId, status, notes) {
    const update = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) update.notes = notes;
    const { data, error: err } = await supabase
      .from('applications')
      .update(update)
      .eq('id', appId)
      .select()
      .single();
    if (err) throw err;
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, ...data } : a))
    );
    return data;
  }

  const stats = {
    total:     applications.length,
    pending:   applications.filter((a) => a.status === 'Pending').length,
    reviewed:  applications.filter((a) => a.status === 'Reviewed').length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    offer:     applications.filter((a) => a.status === 'Offer').length,
    rejected:  applications.filter((a) => a.status === 'Rejected').length,
  };

  return { applications, loading, error, stats, updateStatus, refetch: refetchHRApps };
}
