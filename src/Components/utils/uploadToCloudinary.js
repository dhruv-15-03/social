import envConfig from "../../config/environment";


class CloudinaryUploader {
  constructor() {
    this.config = envConfig.cloudinary;
    this.uiConfig = envConfig.ui;
  }

  validateFile(file, fileType) {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    const maxSizeBytes = this.uiConfig.maxFileSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${this.uiConfig.maxFileSize}MB limit`);
    }

    if (fileType === 'image') {
      const supportedFormats = this.uiConfig.supportedImageFormats;
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!supportedFormats.includes(fileExtension)) {
        throw new Error(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
      }
    }

    return true;
  }

  
  async uploadFile(file, fileType = 'image', options = {}) {
    try {
      this.validateFile(file, fileType);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('cloud_name', this.config.cloudName);

      if (options.folder) {
        formData.append('folder', options.folder);
      }

      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      }

      if (fileType === 'image' && this.uiConfig.imageQuality) {
        formData.append('quality', this.uiConfig.imageQuality.toString());
      }

      const uploadUrl = `${this.config.apiUrl}/${this.config.cloudName}/${fileType}/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`Cloudinary error: ${result.error.message}`);
      }

      // Upload successful - log only in development mode
      if (envConfig.app.isDevelopment) {
        // Debug info available for development
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        createdAt: result.created_at,
      };

    } catch (error) {
      if (envConfig.features.errorLogging) {
        // Log error only when error logging is enabled
      }
      throw error;
    }
  }

  
  async uploadMultipleFiles(files, fileType = 'image', options = {}) {
    const uploadPromises = Array.from(files).map(file => 
      this.uploadFile(file, fileType, options)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      // Multiple file upload failed
      throw error;
    }
  }

  
  getTransformedUrl(publicId, transformations = {}) {
    const baseUrl = `${this.config.apiUrl}/${this.config.cloudName}/image/upload`;
    
    let transformString = '';
    if (Object.keys(transformations).length > 0) {
      const transforms = Object.entries(transformations)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      transformString = `/${transforms}`;
    }

    return `${baseUrl}${transformString}/${publicId}`;
  }

  
  async deleteFile(publicId) {
    // File deletion should be implemented on the backend for security
    return { message: 'Deletion request sent to backend' };
  }
}

const cloudinaryUploader = new CloudinaryUploader();

export const uploadToCloudinary = async (file, fileType = 'image') => {
  if (!file || !fileType) {
    // Error: File and fileType are required
    return null;
  }

  try {
    const result = await cloudinaryUploader.uploadFile(file, fileType);
    return result.url;
  } catch (error) {
    // Upload error handled
    return null;
  }
};

export { cloudinaryUploader };
export default cloudinaryUploader;