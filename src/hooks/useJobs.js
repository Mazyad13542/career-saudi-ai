import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 20;

export function useJobs(filters = {}) {
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [hasMore,  setHasMore]  = useState(false);
  const [page,     setPage]     = useState(0);

  const buildQuery = useCallback((offset = 0) => {
    let q = supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('posted_at',   { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (filters.search) {
      q = q.or(
        `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }
    if (filters.city    && filters.city    !== 'كل المدن')     q = q.eq('city',             filters.city);
    if (filters.region  && filters.region  !== 'كل المناطق')  q = q.eq('region',           filters.region);
    if (filters.sector  && filters.sector  !== 'كل القطاعات') q = q.eq('sector',           filters.sector);
    if (filters.jobType && filters.jobType !== 'كل الأنواع')  q = q.eq('job_type',         filters.jobType);
    if (filters.experienceLevel)                               q = q.eq('experience_level', filters.experienceLevel);
    if (filters.featured)                                      q = q.eq('is_featured',      true);
    if (filters.isRemote)                                      q = q.eq('is_remote',        true);
    if (filters.freshGraduate)                                 q = q.eq('fresh_graduate',   true);

    return q;
  }, [
    filters.search, filters.city, filters.region, filters.sector,
    filters.jobType, filters.experienceLevel, filters.featured,
    filters.isRemote, filters.freshGraduate,
  ]);

  const fetchJobs = useCallback(async (reset = true) => {
    const offset = reset ? 0 : page * PAGE_SIZE;
    if (reset) setLoading(true);
    setError(null);

    const { data, error: err } = await buildQuery(offset);
    if (err) { setError(err.message); setLoading(false); return; }

    const rows = data ?? [];
    if (reset) {
      setJobs(rows);
      setPage(1);
    } else {
      setJobs((prev) => [...prev, ...rows]);
      setPage((p) => p + 1);
    }
    setHasMore(rows.length === PAGE_SIZE);
    setLoading(false);
  }, [buildQuery, page]);

  useEffect(() => { fetchJobs(true); }, [buildQuery]);

  const loadMore = () => { if (!loading && hasMore) fetchJobs(false); };

  return { jobs, loading, error, hasMore, loadMore, refetch: () => fetchJobs(true) };
}

export function useSavedJobs() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setSavedIds(new Set((data ?? []).map((r) => r.job_id)));
        setLoading(false);
      });
  }, [user]);

  const toggle = async (jobId) => {
    if (!user) return;
    if (savedIds.has(jobId)) {
      await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: jobId });
      setSavedIds((s) => { const n = new Set(s); n.delete(jobId); return n; });
    } else {
      await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId });
      setSavedIds((s) => new Set([...s, jobId]));
    }
  };

  return { savedIds, loading, toggle };
}

// Admin-only hook: see all jobs regardless of status
export function useAdminJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async (statusFilter = 'all') => {
    setLoading(true);
    let q = supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    const { data, error: err } = await q;
    setError(err?.message ?? null);
    setJobs(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  // Duplicate check: same title+company+city (case-insensitive)
  async function checkDuplicate(title, company, city) {
    const { data } = await supabase
      .from('jobs')
      .select('id, title, company, city')
      .ilike('title',   title)
      .ilike('company', company)
      .limit(1);
    return (data ?? []).length > 0 ? data[0] : null;
  }

  async function createJob(fields) {
    const { data, error: err } = await supabase
      .from('jobs')
      .insert({ ...fields, status: fields.status ?? 'approved' })
      .select()
      .single();
    if (err) throw err;
    setJobs((prev) => [data, ...prev]);
    return data;
  }

  async function bulkImport(rows) {
    const results = { inserted: 0, duplicates: 0, errors: 0, rows: [] };
    for (const row of rows) {
      const dup = await checkDuplicate(row.title, row.company, row.city ?? '');
      if (dup) { results.duplicates++; results.rows.push({ ...row, _result: 'duplicate', _dup: dup }); continue; }
      const { data, error: err } = await supabase
        .from('jobs')
        .insert({ ...row, status: 'pending' })
        .select()
        .single();
      if (err) { results.errors++; results.rows.push({ ...row, _result: 'error', _err: err.message }); }
      else { results.inserted++; results.rows.push({ ...data, _result: 'inserted' }); }
    }
    await fetch();
    return results;
  }

  async function updateJob(id, fields) {
    const { data, error: err } = await supabase
      .from('jobs').update(fields).eq('id', id).select().single();
    if (err) throw err;
    setJobs((prev) => prev.map((j) => (j.id === id ? data : j)));
    return data;
  }

  async function deleteJob(id) {
    const { error: err } = await supabase.from('jobs').delete().eq('id', id);
    if (err) throw err;
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  async function setStatus(id, status) {
    return updateJob(id, { status });
  }

  async function toggleActive(id, current) {
    return updateJob(id, { is_active: !current });
  }

  const stats = {
    total:    jobs.length,
    approved: jobs.filter((j) => j.status === 'approved').length,
    pending:  jobs.filter((j) => j.status === 'pending').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
    active:   jobs.filter((j) => j.is_active && j.status === 'approved').length,
  };

  return { jobs, loading, error, stats, createJob, updateJob, deleteJob, setStatus, toggleActive, bulkImport, checkDuplicate, refetch: fetch };
}
