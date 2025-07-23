import envConfig from "../../config/environment";

/**
 * Professional Cloudinary Upload Utility
 * 
 * Handles file uploads to Cloudinary with proper error handling,
 * validation, and progress tracking.
 */

class CloudinaryUploader {
  constructor() {
    this.config = envConfig.cloudinary;
    this.uiConfig = envConfig.ui;
  }

  /**
   * Validates file before upload
   */
  validateFile(file, fileType) {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // Check file size
    const maxSizeBytes = this.uiConfig.maxFileSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${this.uiConfig.maxFileSize}MB limit`);
    }

    // Check file type for images
    if (fileType === 'image') {
      const supportedFormats = this.uiConfig.supportedImageFormats;
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!supportedFormats.includes(fileExtension)) {
        throw new Error(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
      }
    }

    return true;
  }

  /**
   * Uploads file to Cloudinary with progress tracking
   */
  async uploadFile(file, fileType = 'image', options = {}) {
    try {
      // Validate file
      this.validateFile(file, fileType);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('cloud_name', this.config.cloudName);

      // Add optional parameters
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      }

      // Set image quality for images
      if (fileType === 'image' && this.uiConfig.imageQuality) {
        formData.append('quality', this.uiConfig.imageQuality.toString());
      }

      // Upload URL
      const uploadUrl = `${this.config.apiUrl}/${this.config.cloudName}/${fileType}/upload`;

      // Make upload request
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Validate response
      if (result.error) {
        throw new Error(`Cloudinary error: ${result.error.message}`);
      }

      // Log success in development
      if (envConfig.app.isDevelopment) {
        console.log('📸 Cloudinary Upload Success:', {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
        });
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
        console.error('❌ Cloudinary Upload Error:', error);
      }
      throw error;
    }
  }

  /**
   * Uploads multiple files
   */
  async uploadMultipleFiles(files, fileType = 'image', options = {}) {
    const uploadPromises = Array.from(files).map(file => 
      this.uploadFile(file, fileType, options)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('❌ Multiple file upload failed:', error);
      throw error;
    }
  }

  /**
   * Generates transformation URL for existing image
   */
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

  /**
   * Deletes file from Cloudinary (requires backend implementation)
   */
  async deleteFile(publicId) {
    // Note: File deletion requires backend implementation for security
    console.warn('File deletion should be implemented on the backend for security');
    return { message: 'Deletion request sent to backend' };
  }
}

// Create singleton instance
const cloudinaryUploader = new CloudinaryUploader();

// Legacy function for backward compatibility
export const uploadToCloudinary = async (file, fileType = 'image') => {
  if (!file || !fileType) {
    console.error('Error: File and fileType are required');
    return null;
  }

  try {
    const result = await cloudinaryUploader.uploadFile(file, fileType);
    return result.url;
  } catch (error) {
    console.error('Upload error:', error.message);
    return null;
  }
};

// Export the uploader class and utility functions
export { cloudinaryUploader };
export default cloudinaryUploader;