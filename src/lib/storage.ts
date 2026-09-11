const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xkqlaumvrdbhddllrsan.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET = 'lodge-media';

export async function createSignedUploadUrl(folder: string, originalFileName: string) {
  const ext = originalFileName.includes('.') ? originalFileName.split('.').pop()?.toLowerCase() : 'bin';
  const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const filePath = `${folder}/${cleanName}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${filePath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ expiresIn: 900 }) // 15 min
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create signed upload URL: ${errText}`);
  }

  const data = await res.json();
  const uploadUrl = `${SUPABASE_URL}/storage/v1${data.url}`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;

  return { uploadUrl, publicUrl, filePath };
}

export async function deleteStorageFile(publicUrl: string) {
  try {
    if (!publicUrl || !publicUrl.includes(BUCKET)) return;
    
    // Extract path after /public/lodge-media/
    const marker = `/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    
    const filePath = publicUrl.substring(idx + marker.length);
    if (!filePath) return;

    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY
      }
    });
  } catch (err) {
    console.error('Error deleting storage file:', err);
  }
}
