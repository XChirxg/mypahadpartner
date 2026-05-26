const CLOUDINARY_CLOUD_NAME = 'ddnuuxh9t';
const CLOUDINARY_PRESET = 'mypahad';

// Uploads a File, Blob, or URL to Cloudinary (using unsigned preset)
async function uploadToCloudinary(fileOrUrl) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', fileOrUrl);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Upload failed');
    }
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Optimizes a Cloudinary URL based on display type
function getOptimizedImageUrl(url, type) {
  if (!url) return '';
  if (url.startsWith('data:')) return url; // Fallback for legacy base64
  
  if (url.includes(`res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`)) {
    let transformation = '';
    switch (type) {
      case 'dp':
      case 'avatar':
        transformation = 'w_150,h_150,c_fill,f_auto,q_auto';
        break;
      case 'card':
      case 'thumbnail':
        transformation = 'w_400,h_400,c_fill,f_auto,q_auto';
        break;
      case 'detail':
      case 'large':
        transformation = 'w_800,c_limit,f_auto,q_auto';
        break;
      case 'ad':
        transformation = 'w_800,h_400,c_fill,f_auto,q_auto';
        break;
      case 'gallery':
      case 'story':
        transformation = 'w_1080,c_limit,f_auto,q_auto';
        break;
      default:
        transformation = 'f_auto,q_auto';
    }
    return url.replace('/image/upload/', `/image/upload/${transformation}/`);
  }
  return url;
}
