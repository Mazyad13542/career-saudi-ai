import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useAdmin() {
  const { profile } = useAuth();
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const isAdmin = profile?.role === 'admin';

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);

    const [
      { count: totalUsers },
      { count: totalJobs },
      { count: activeJobs },
      { count: pendingJobs },
      { count: totalApps },
      { count: totalPayments },
      { data: recentPayments },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('status', 'approved'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('payments').select('amount_sar').eq('status', 'completed'),
    ]);

    const revenue = (recentPayments ?? []).reduce((s, p) => s + Number(p.amount_sar ?? 0), 0);

    setStats({ totalUsers, totalJobs, activeJobs, pendingJobs, totalApps, totalPayments, revenue });
    setLoading(false);
  }, [isAdmin]);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, plan, plan_expires_at, created_at, career_score, city')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setUsers(data ?? []);
  }, [isAdmin]);

  const fetchJobs = useCallback(async () => {
    if (!isAdmin) return;
    const { data, error: err } = await supabase
      .from('jobs')
      .select('id, title, company, city, is_active, applications_count, views_count, posted_at, created_by')
      .order('posted_at', { ascending: false });
    if (err) setError(err.message);
    else setJobs(data ?? []);
  }, [isAdmin]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchJobs();
  }, [fetchStats, fetchUsers, fetchJobs]);

  async function setUserRole(userId, role) {
    const { error: err } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    if (err) throw err;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  }

  async function toggleJobActive(jobId, current) {
    const { error: err } = await supabase
      .from('jobs')
      .update({ is_active: !current })
      .eq('id', jobId);
    if (err) throw err;
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, is_active: !current } : j)));
  }

  async function deleteJob(jobId) {
    const { error: err } = await supabase.from('jobs').delete().eq('id', jobId);
    if (err) throw err;
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  return {
    isAdmin, stats, users, jobs, loading, error,
    setUserRole, toggleJobActive, deleteJob,
    refetch: () => { fetchStats(); fetchUsers(); fetchJobs(); },
  };
}
