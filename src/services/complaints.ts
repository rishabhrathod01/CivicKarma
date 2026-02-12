import type { ComplaintStatus, Department } from '../types/complaints';
import { supabase } from './supabase';

interface GetComplaintsParams {
  limit?: number;
  offset?: number;
  status?: ComplaintStatus;
  category?: string;
  userId?: string;
}

interface CreateComplaintData {
  userId: string;
  categoryId: string;
  subcategoryId?: string | null;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  department: Department;
}

export const complaintsService = {
  /**
   * Fetch a paginated list of complaints with photos and category info joined.
   */
  async getComplaints({
    limit = 20,
    offset = 0,
    status,
    category,
    userId,
  }: GetComplaintsParams = {}) {
    let query = supabase
      .from('complaints')
      .select(
        `
        *,
        complaint_photos ( id, photo_url, created_at ),
        categories!inner ( name, name_kn ),
        subcategories ( name, name_kn )
      `,
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category_id', category);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Fetch a single complaint by ID with all related data.
   */
  async getComplaintById(id: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select(
        `
        *,
        complaint_photos ( id, photo_url, created_at ),
        categories ( name, name_kn, department, icon ),
        subcategories ( name, name_kn ),
        complaint_status_history ( id, old_status, new_status, changed_by, notes, created_at ),
        profiles!complaints_user_id_fkey ( id, name, avatar_url )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new complaint.
   */
  async createComplaint(data: CreateComplaintData) {
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        user_id: data.userId,
        category_id: data.categoryId,
        subcategory_id: data.subcategoryId ?? null,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address ?? null,
        department: data.department,
      })
      .select()
      .single();

    if (error) throw error;
    return complaint;
  },

  /**
   * Update the status of a complaint and record the change in status history.
   */
  async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    changedBy: string,
    notes?: string,
  ) {
    // Fetch current status so we can record the transition
    const { data: current, error: fetchError } = await supabase
      .from('complaints')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Update the complaint status
    const { error: updateError } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', id);

    if (updateError) throw updateError;

    // Insert status history record
    const { error: historyError } = await supabase
      .from('complaint_status_history')
      .insert({
        complaint_id: id,
        old_status: current.status,
        new_status: status,
        changed_by: changedBy,
        notes: notes ?? null,
      });

    if (historyError) throw historyError;
  },

  /**
   * Fetch complaints filed by a specific user.
   */
  async getMyComplaints(userId: string, limit = 20, offset = 0) {
    return complaintsService.getComplaints({ userId, limit, offset });
  },

  /**
   * Call the DB function to check for duplicate reports near a location.
   * Returns `true` if a duplicate exists.
   */
  async checkDuplicate(
    lat: number,
    lng: number,
    categoryId: string,
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc('check_duplicate_report', {
      p_lat: lat,
      p_lng: lng,
      p_category_id: categoryId,
    });

    if (error) throw error;
    return data as boolean;
  },
};
