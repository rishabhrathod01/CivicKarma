import { supabase } from './supabase';

const BUCKET_NAME = 'complaint-photos';

export const photosService = {
  /**
   * Upload a photo to the `complaint-photos` Supabase storage bucket.
   * Returns the public URL of the uploaded file.
   *
   * @param complaintId - Used as a folder prefix in the bucket.
   * @param uri - Local file URI (e.g. from expo-image-picker).
   */
  async uploadPhoto(complaintId: string, uri: string): Promise<string> {
    // Build a unique file name
    const fileExt = uri.split('.').pop() ?? 'jpg';
    const fileName = `${complaintId}/${Date.now()}.${fileExt}`;

    // Convert the local URI into a Blob-like object for upload
    const response = await fetch(uri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    return publicUrl;
  },

  /**
   * Insert a photo record into the `complaint_photos` table.
   */
  async addPhotoToComplaint(complaintId: string, photoUrl: string) {
    const { data, error } = await supabase
      .from('complaint_photos')
      .insert({
        complaint_id: complaintId,
        photo_url: photoUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all photos for a given complaint.
   */
  async getPhotosForComplaint(complaintId: string) {
    const { data, error } = await supabase
      .from('complaint_photos')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },
};
