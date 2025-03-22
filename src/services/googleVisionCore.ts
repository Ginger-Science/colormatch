// src/services/googleVisionCore.ts

import { ANIMAL_LABELS } from './constants'

export interface VisionAnalysisResult {
  description: string
  mainObject: string
  isAnimal: boolean
  matchedLabel: string
  rawResponse: any
}

export async function analyzeImageWithVision(imageBuffer: Buffer): Promise<VisionAnalysisResult> {
  const API_KEY = process.env.GOOGLE_API_KEY
  if (!API_KEY) {
    throw new Error('Google Vision API key not configured')
  }

  const base64Image = imageBuffer.toString('base64')

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10
            }
          ]
        }]
      })
    }
  )

  if (!response.ok) {
    throw new Error('Vision API request failed')
  }

  const data = await response.json()
  const labels = data.responses[0]?.labelAnnotations || []
  const objects = data.responses[0]?.localizedObjectAnnotations || []

// First check if it's an animal (using ANIMAL_LABELS for validation only)
  const matchedLabel = labels.find(label => 
    ANIMAL_LABELS.includes(label.description.toLowerCase())
  )?.description || ''

  // wtf Claude
  const isAnimal = !!matchedLabel

  // For mainObject, use the first/highest confidence label from Vision API
  // This will be its best guess at the specific species/type
  const mainObject = labels[0]?.description || 'Unknown'

  console.log('Vision API labels:', labels.map(l => l.description))
  console.log('Validation label match:', matchedLabel)
  console.log('Selected main object:', mainObject)

  const { description } = constructDescription(labels, objects)

  return {
    description,
    mainObject,  // Best species guess from Vision API
    isAnimal,    // Validation result using ANIMAL_LABELS
    matchedLabel,
    rawResponse: data.responses[0]
  }
}

function constructDescription(labels: any[], objects: any[]): { description: string } {
  const topLabels = labels
    .filter(label => label.score > 0.7)
    .map(label => label.description)
    .slice(0, 5)

  const topObjects = objects
    .filter(obj => obj.score > 0.7)
    .map(obj => obj.name)
    .filter((value, index, self) => self.indexOf(value) === index)
    .slice(0, 3)

  let description = "The scene includes "
  description += topLabels.join(", ") + "."

  return { description }
}
