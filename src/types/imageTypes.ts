export interface ImageConversionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export interface UploadedImage {
  id: string;
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
}
