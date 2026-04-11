/**
 * Cloudflare R2 Upload Integration
 * 
 * This module handles photo uploads to Cloudflare R2 storage.
 * Currently uses a mock implementation that creates local blob URLs.
 * To connect to real R2, configure the environment variables below
 * and uncomment the Worker proxy implementation.
 * 
 * Required env vars for production:
 * - VITE_R2_WORKER_URL: URL of the Cloudflare Worker that proxies R2 uploads
 * - VITE_R2_PUBLIC_URL: Public URL prefix for stored files
 */

interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  uploadedAt: string;
}

/**
 * Generate a unique file key for R2 storage
 * Format: clients/{clientId}/photos/{date}_{viewType}_{uuid}.{ext}
 */
function generateFileKey(clientId: string, viewType: string, fileName: string): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const uuid = crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
  const ext = fileName.split('.').pop() || 'jpg';
  return `clients/${clientId}/photos/${date}_${viewType}_${uuid}.${ext}`;
}

/**
 * Upload a file to Cloudflare R2 via Worker proxy
 * 
 * Falls back to local blob URL if no Worker URL is configured.
 */
export async function uploadToR2(
  file: File,
  clientId: string,
  viewType: string
): Promise<UploadResult> {
  const workerUrl = import.meta.env?.VITE_R2_WORKER_URL;
  const publicUrl = import.meta.env?.VITE_R2_PUBLIC_URL;
  const key = generateFileKey(clientId, viewType, file.name);

  // ─── Production: Upload via Cloudflare Worker ───
  if (workerUrl) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      formData.append('clientId', clientId);
      formData.append('viewType', viewType);

      const response = await fetch(`${workerUrl}/upload`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        url: data.url || `${publicUrl}/${key}`,
        key,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('R2 upload failed, falling back to local:', error);
      // Fall through to local mock
    }
  }

  // ─── Development: Local blob URL (mock) ───
  const blobUrl = URL.createObjectURL(file);
  
  console.log(`[R2 Mock] File uploaded locally:`, {
    key,
    size: `${(file.size / 1024).toFixed(1)} KB`,
    type: file.type,
    clientId,
    viewType,
  });

  return {
    url: blobUrl,
    key,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  const workerUrl = import.meta.env?.VITE_R2_WORKER_URL;

  if (workerUrl) {
    try {
      const response = await fetch(`${workerUrl}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      return response.ok;
    } catch (error) {
      console.error('R2 delete failed:', error);
      return false;
    }
  }

  // In mock mode, revoke the blob URL if it's a blob
  if (key.startsWith('blob:')) {
    URL.revokeObjectURL(key);
  }
  return true;
}

/**
 * Cloudflare Worker template for R2 proxy
 * 
 * Deploy this as a Cloudflare Worker with R2 binding:
 * 
 * ```js
 * export default {
 *   async fetch(request, env) {
 *     const url = new URL(request.url);
 *     
 *     if (request.method === 'PUT' && url.pathname === '/upload') {
 *       const formData = await request.formData();
 *       const file = formData.get('file');
 *       const key = formData.get('key');
 *       
 *       await env.KCALIPER_BUCKET.put(key, file.stream(), {
 *         httpMetadata: { contentType: file.type },
 *       });
 *       
 *       return Response.json({ 
 *         url: `${env.PUBLIC_URL}/${key}`,
 *         key 
 *       });
 *     }
 *     
 *     if (request.method === 'DELETE' && url.pathname === '/delete') {
 *       const { key } = await request.json();
 *       await env.KCALIPER_BUCKET.delete(key);
 *       return new Response('OK');
 *     }
 *     
 *     return new Response('Not Found', { status: 404 });
 *   }
 * };
 * ```
 */
