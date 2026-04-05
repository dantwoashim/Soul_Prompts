import { createClient } from '@supabase/supabase-js';

function getStorageClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!url || !key || !bucket) {
    return null;
  }

  return {
    bucket,
    client: createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  };
}

export async function uploadDashboardAsset(file: File) {
  const storage = getStorageClient();
  if (!storage) {
    throw new Error('Asset storage is not configured');
  }

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`;
  const objectPath = `dashboard/${safeName}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await storage.client.storage
    .from(storage.bucket)
    .upload(objectPath, Buffer.from(arrayBuffer), {
      contentType: file.type || 'application/octet-stream',
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data } = storage.client.storage.from(storage.bucket).getPublicUrl(objectPath);
  return {
    objectPath,
    publicUrl: data.publicUrl
  };
}
