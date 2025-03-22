// src/services/googleVisionService.ts

import { APP_CONFIG } from "../config/appConfig"

export interface VisionAnalysisResult {
  description?: string
  error?: string
  isAnimal?: boolean
  rawResponse?: any
}

export interface VisionConfig {
  modelId: string
  name: string
  description: string
}

export const VISION_CONFIG: VisionConfig = {
  modelId: "google-vision-v1",
  name: "Ginger Sightings in the Wild",
  description: "Upload photos of " + APP_CONFIG.description + " in " + APP_CONFIG.location + " to help discover the global MC1R phenotype variations.",
}

export async function analyzeImage(imageBuffer: Buffer, filename: string): Promise<VisionAnalysisResult> {
  try {
    // Create FormData using more universal approach
    const formData = new FormData()

    // Create Blob with explicit JPEG type
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })

    // Use File constructor for maximum compatibility
    const file = new File([blob], filename, { type: 'image/jpeg' })

    // Append file to FormData
    formData.append('image', file, filename)

    // Log FormData contents for debugging
    for (const [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value)
    }

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      // More detailed error handling
      const errorText = await response.text()
      console.error('Analysis response error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })

      throw new Error(errorText || 'Failed to analyze image')
    }

    return await response.json()
  } catch (error) {
    console.error('Vision analysis error:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to analyze image'
    }
  }
}
