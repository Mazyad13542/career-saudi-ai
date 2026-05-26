import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);
    const rows = data ?? [];
    setNotifications(rows);
    setUnreadCount(rows.filter(n => !n.is_read).length);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    if (!user) return;
    // Real-time subscription
    const channel = supabase
      .channel(`notif_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(c => c + 1);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetchNotifications]);

  const markRead = useCallback(async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [user]);

  const deleteNotification = useCallback(async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(c => Math.max(0, c - 1));
  }, []);

  // Add a local notification (for client-side tracking)
  const addLocal = useCallback(async (notif) => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .insert({ ...notif, user_id: user.id })
      .select()
      .single();
    if (data) {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(c => c + 1);
    }
  }, [user]);

  return {
    notifications, loading, unreadCount,
    markRead, markAllRead, deleteNotification, addLocal,
    refetch: fetchNotifications,
  };
}
