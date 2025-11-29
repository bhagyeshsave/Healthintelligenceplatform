/**
 * S3 upload utilities for medical documents
 * Uses AWS SDK via environment variables
 */

const AWS_REGION = 'us-east-1';
const BUCKET_NAME = 'med-document-input';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url: string;
}

/**
 * Upload file to S3 bucket
 */
export async function uploadToS3(file: File): Promise<UploadedFile> {
  try {
    // Call backend API to upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', BUCKET_NAME);
    
    const response = await fetch('/api/upload-to-s3', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.fileKey,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: data.url,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

/**
 * Get list of uploaded files from S3
 */
export async function getUploadedFiles(): Promise<UploadedFile[]> {
  try {
    const response = await fetch(`/api/list-s3-files?bucket=${BUCKET_NAME}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

/**
 * Download file from S3
 */
export async function downloadFromS3(fileKey: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(`/api/download-from-s3?key=${encodeURIComponent(fileKey)}&bucket=${BUCKET_NAME}`);
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
