import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useJobSources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('job_sources')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setSources(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSources(); }, [fetchSources]);

  const createSource = useCallback(async (fields) => {
    const { data, error: err } = await supabase
      .from('job_sources')
      .insert([fields])
      .select()
      .single();
    if (err) throw err;
    setSources(prev => [data, ...prev]);
    return data;
  }, []);

  const updateSource = useCallback(async (id, fields) => {
    const { data, error: err } = await supabase
      .from('job_sources')
      .update(fields)
      .eq('id', id)
      .select()
      .single();
    if (err) throw err;
    setSources(prev => prev.map(s => s.id === id ? data : s));
    return data;
  }, []);

  const deleteSource = useCallback(async (id) => {
    const { error: err } = await supabase
      .from('job_sources')
      .delete()
      .eq('id', id);
    if (err) throw err;
    setSources(prev => prev.filter(s => s.id !== id));
  }, []);

  return { sources, loading, error, refetch: fetchSources, createSource, updateSource, deleteSource };
}

export function useImportLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('import_logs')
      .select('*')
      .order('imported_at', { ascending: false })
      .limit(50);
    setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const logImport = useCallback(async (entry) => {
    const { data, error } = await supabase
      .from('import_logs')
      .insert([entry])
      .select()
      .single();
    if (error) throw error;
    setLogs(prev => [data, ...prev]);
    return data;
  }, []);

  return { logs, loading, refetch: fetchLogs, logImport };
}
