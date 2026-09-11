export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<Blob> {
  // If not image or if svg/gif, don't compress
  if (!file.type.startsWith('image/') || file.type.includes('gif') || file.type.includes('svg')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                resolve(blob);
              } else {
                resolve(file); // fallback if compression didn't reduce
              }
            },
            'image/jpeg',
            quality
          );
        } else {
          resolve(file);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadToSupabase(
  file: File,
  folder = 'stories',
  onProgress?: (percent: number) => void
): Promise<{ publicUrl: string; mediaType: 'IMAGE' | 'VIDEO' }> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name);
  const mediaType: 'IMAGE' | 'VIDEO' = isVideo ? 'VIDEO' : 'IMAGE';

  // Check 50MB Supabase limit for video
  const maxBytes = 50 * 1024 * 1024;
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `O arquivo tem ${sizeMb} MB. O limite máximo para upload direto no plano gratuito é de 50 MB. Por favor, escolha um vídeo mais curto (15 a 45 segundos) ou comprima-o.`
    );
  }

  // If image, compress it client-side before upload
  let uploadPayload: Blob = file;
  let finalFileName = file.name;
  let contentType = file.type || 'application/octet-stream';

  if (!isVideo) {
    try {
      uploadPayload = await compressImage(file);
      contentType = 'image/jpeg';
      if (!finalFileName.toLowerCase().endsWith('.jpg') && !finalFileName.toLowerCase().endsWith('.jpeg')) {
        finalFileName = finalFileName.replace(/\.[^.]+$/, '') + '.jpg';
      }
    } catch (err) {
      console.warn('Image compression fallback to original:', err);
    }
  }

  // 1. Get signed upload URL from our API
  const urlRes = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, fileName: finalFileName })
  });

  if (!urlRes.ok) {
    const errData = await urlRes.json();
    throw new Error(errData.error || 'Falha ao iniciar envio para o servidor de mídia');
  }

  const { uploadUrl, publicUrl } = await urlRes.json();

  // 2. Upload directly to Supabase via XMLHttpRequest with real progress tracking
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(new Error(`Erro no envio para o armazenamento: status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Falha de conexão durante o envio do arquivo'));
    };

    xhr.send(uploadPayload);
  });

  return { publicUrl, mediaType };
}
