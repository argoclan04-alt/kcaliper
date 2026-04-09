/**
 * ARGO R2 WORKER
 * Handling Secure Multimedia Uploads/Downloads via Presigned URLs or Direct Stream.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    // SECURITY: Validate Auth Token from Supabase/ARGO
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !isValidToken(authHeader)) {
       return new Response('Unauthorized', { status: 401 });
    }

    switch (request.method) {
      case 'PUT':
        // Upload to R2
        await env.ARGO_BUCKET.put(key, request.body, {
          httpMetadata: request.headers,
        });
        return new Response(`Put ${key} successfully!`, { status: 200 });

      case 'GET':
        // Download from R2
        const object = await env.ARGO_BUCKET.get(key);
        if (object === null) {
          return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
          headers,
        });

      case 'DELETE':
        // Delete from R2 (Coach/Admin only)
        await env.ARGO_BUCKET.delete(key);
        return new Response('Deleted!', { status: 200 });

      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { Allow: 'PUT, GET, DELETE' },
        });
    }
  },
};

/**
 * Placeholder for Token Validation Logic.
 * In production, verify the Supabase JWT.
 */
function isValidToken(token) {
  // Logic to verify Supabase JWT
  return true; 
}
