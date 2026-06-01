export const MAX_IMAGE_ATTACHMENTS = 3;

export function pickImageFiles(fileList, currentCount = 0) {
  const files = Array.from(fileList ?? []);
  const remaining = Math.max(0, MAX_IMAGE_ATTACHMENTS - currentCount);
  const accepted = [];
  const rejected = [];

  files.forEach((file) => {
    if (!file?.type?.startsWith('image/')) {
      rejected.push({ file, reason: 'type' });
      return;
    }
    if (accepted.length >= remaining) {
      rejected.push({ file, reason: 'limit' });
      return;
    }
    accepted.push(file);
  });

  return {
    accepted,
    rejected,
    hasRejectedType: rejected.some(item => item.reason === 'type'),
    hasRejectedLimit: rejected.some(item => item.reason === 'limit'),
  };
}

export async function readCompressedImage(file, options = {}) {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.78,
  } = options;
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return source;
  }
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
}

export async function readImageAttachments(fileList, currentImages = []) {
  const picked = pickImageFiles(fileList, currentImages.length);
  const images = await Promise.all(picked.accepted.map(file => readCompressedImage(file)));
  return {
    ...picked,
    images,
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片加载失败'));
    image.src = src;
  });
}
