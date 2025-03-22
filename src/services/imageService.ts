// src/services/imageService.ts
import imageCompression from 'browser-image-compression'
import * as FileType from 'file-type'

export interface ImageConversionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export async function normalizeImageUpload(
  file: File, 
  options: ImageConversionOptions = {}
): Promise<File> {
  try {
    // Detailed initial logging
    console.log('Original File Details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Default conversion options with cross-browser considerations
    const defaultOptions = {
      maxSizeMB: 2, // Keep original size limit
      maxWidthOrHeight: 1920, // Standard max dimension
      useWebWorker: true,
      maxIteration: 10,       // Aggressive compression
      fileType: 'image/jpeg'  // Force JPEG conversion
    }

    const mergedOptions = { ...defaultOptions, ...options }

    // Force conversion to ensure compatibility
    const compressedFile = await imageCompression(file, {
      ...mergedOptions,
      fileType: 'image/jpeg', // Force JPEG
      initialQuality: 0.8
    })

    // Create a new File object with explicit JPEG type
    const normalizedImage = new File(
      [compressedFile], 
      'converted-image.jpg', 
      { type: 'image/jpeg' }
    )

    // Logging normalized file details
    console.log('Normalized File Details:', {
      name: normalizedImage.name,
      type: normalizedImage.type,
      size: normalizedImage.size
    })

    return normalizedImage
  } catch (error) {
    console.error('Image normalization error:', error)
    throw error
  }
}
