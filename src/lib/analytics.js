import { supabase } from './supabase';

export const EVENTS = {
  LOGIN:              'login',
  REGISTER:           'register',
  LOGOUT:             'logout',
  CV_UPLOADED:        'cv_uploaded',
  CV_DOWNLOADED:      'cv_downloaded',
  CV_DELETED:         'cv_deleted',
  JOB_VIEWED:         'job_viewed',
  JOB_SAVED:          'job_saved',
  JOB_APPLIED:        'job_applied',
  PROFILE_UPDATED:    'profile_updated',
  SUBSCRIPTION_PAID:  'subscription_paid',
  INTERVIEW_STARTED:  'interview_started',
  SETTINGS_UPDATED:   'settings_updated',
  PAGE_VIEW:          'page_view',
};

export async function track(event, metadata = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('activity_logs').insert({
      user_id:  user.id,
      event,
      metadata: { ...metadata, ts: new Date().toISOString() },
    });
  } catch {
    // analytics failures must never break the app
  }
}
