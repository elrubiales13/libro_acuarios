import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || import.meta.env?.PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env?.SUPABASE_SERVICE_ROLE_KEY;
    const DEFAULT_BUCKET = process.env.PUBLIC_SUPABASE_BUCKET || import.meta.env?.PUBLIC_SUPABASE_BUCKET || '';

    if (!SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' }), { status: 500 });
    }
    if (!SUPABASE_URL) {
      return new Response(JSON.stringify({ error: 'SUPABASE URL is not configured on the server.' }), { status: 500 });
    }

    const supabase = createClient(String(SUPABASE_URL), String(SERVICE_ROLE_KEY));

    const form = await request.formData();
    const fileAny = form.get('file');
    const bucketAny = form.get('bucket');
    const bucket = (typeof bucketAny === 'string' ? bucketAny : '') || DEFAULT_BUCKET;

    // Accept both browser File and polyfilled blobs
    if (!fileAny || typeof (fileAny as any).arrayBuffer !== 'function') {
      return new Response(JSON.stringify({ error: 'No file provided or unsupported file object' }), { status: 400 });
    }

    if (!bucket) {
      return new Response(JSON.stringify({ error: 'No bucket configured' }), { status: 400 });
    }

    const file = fileAny as any;
    const arrayBuffer = await file.arrayBuffer();
    const buf = new Uint8Array(arrayBuffer);
    const originalName = file.name || `upload-${Date.now()}`;
    const safeName = String(originalName).replace(/\s+/g, '_');
    const rnd = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now());
    const path = `${rnd}_${safeName}`;

    const { error } = await supabase.storage.from(String(bucket)).upload(path, buf, {
      contentType: file.type || 'application/octet-stream',
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    const { data: urlData } = supabase.storage.from(String(bucket)).getPublicUrl(path);
    const publicUrl = urlData?.publicUrl || null;

    return new Response(JSON.stringify({ publicUrl, path }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as any)?.message || String(err) }), { status: 500 });
  }
}
