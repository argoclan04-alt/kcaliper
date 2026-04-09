/**
 * Storage Utility for ARGO - Integration with Cloudflare R2
 */

// Placeholder for the Cloudflare Worker URL
// In production, this should be in .env: VITE_R2_WORKER_URL
const R2_WORKER_URL = import.meta.env.VITE_R2_WORKER_URL || 'https://argo-storage.workers.dev';

export async function uploadPhotoToR2(file: File, metadata: { clientId: string, date: string, viewType: string }): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('clientId', metadata.clientId);
  formData.append('date', metadata.date);
  formData.append('viewType', metadata.viewType);

  try {
    const response = await fetch(`${R2_WORKER_URL}/upload`, {
      method: 'POST',
      body: formData,
      // Note: We don't set Content-Type header on FormData, the browser does it with the boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload photo to R2');
    }

    const data = await response.json();
    return data.url; // The permanent URL of the photo in R2
  } catch (error) {
    console.error('R2 Upload Error:', error);
    throw error;
  }
}
