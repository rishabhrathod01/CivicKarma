import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import type { Tables, TablesUpdate } from '../types/database';
import { supabase } from './supabase';

export const authService = {
  /**
   * Send a one-time password to the given phone number.
   */
  async signInWithOtp(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return data;
  },

  /**
   * Verify the OTP token sent to the phone number and return the session.
   */
  async verifyOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the currently authenticated user.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current auth session (if any).
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Fetch the authenticated user's profile from the `profiles` table.
   */
  async getUser(userId: string): Promise<Tables<'profiles'> | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Update the user's profile with the supplied fields.
   */
  async updateProfile(userId: string, updates: TablesUpdate<'profiles'>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Subscribe to auth state changes.
   * Returns an unsubscribe function.
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return subscription.unsubscribe.bind(subscription);
  },
};
