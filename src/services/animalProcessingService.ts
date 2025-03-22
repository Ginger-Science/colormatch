// src/services/animalProcessingService.ts
import exif from 'exif-reader'
import { publishAnimalRecord } from './laconicService'
import { uploadToIpfs } from './pinataService'
import { ANIMAL_LABELS } from './constants'

interface Coordinates {
  lat: number
  lng: number
}

function generateRandomCoordinates(): Coordinates {
  const lat = Math.round(Math.random() * 180 - 90)
  const lng = Math.round(Math.random() * 360 - 180)
  return { lat, lng }
}

async function extractCoordinates(imageBuffer: Buffer): Promise<Coordinates> {
  console.log('Generating random coordinates (EXIF extraction disabled)')
  return generateRandomCoordinates()
}

/*
async function extractCoordinates(imageBuffer: Buffer): Promise<Coordinates> {
  // Check the environment variable to always use random coordinates
  if (process.env.NEXT_PUBLIC_ALWAYS_RANDOM_COORDS === 'true') {
    console.log('Using random coordinates as per environment configuration')
    return generateRandomCoordinates()
  }

  try {
    let offset = 0
    while (offset < imageBuffer.length - 2) {
      if (imageBuffer[offset] === 0xFF && imageBuffer[offset + 1] === 0xE1) {
        const exifBuffer = imageBuffer.slice(offset + 4)
        const exifData = exif(exifBuffer)

        // Check if GPS data exists and has valid latitude and longitude
        if (
          exifData?.gps?.latitude?.degrees !== undefined && 
          exifData?.gps?.longitude?.degrees !== undefined
        ) {
          const lat = convertToDecimal(
            exifData.gps.latitude.degrees, 
            exifData.gps.latitude.minutes || 0, 
            exifData.gps.latitude.seconds || 0, 
            exifData.gps.latitude.direction || 'N'
          )
          const lng = convertToDecimal(
            exifData.gps.longitude.degrees, 
            exifData.gps.longitude.minutes || 0, 
            exifData.gps.longitude.seconds || 0, 
            exifData.gps.longitude.direction || 'E'
          )

          return {
            lat: Math.round(lat),
            lng: Math.round(lng)
          }
        }
        break
      }
      offset++
    }

    console.log('No EXIF data found, generating random coordinates')
    return generateRandomCoordinates()
  } catch (error) {
    console.error('Error extracting EXIF data:', error)
    return generateRandomCoordinates()
  }
}
*/

export async function processAnimalImage(
  imageBuffer: Buffer,
  visionDescription: string,
  visionResponse: any,
  filename: string = 'animal-image.jpg'
) {
  try {
    // Get coordinates
    const coordinates = await extractCoordinates(imageBuffer)
    console.log('Using coordinates:', coordinates)

    // Rest of the existing implementation
    const ipfsUrl = await uploadToIpfs(imageBuffer, filename)
    console.log('Image uploaded to IPFS:', ipfsUrl)

    const labels = visionResponse?.labelAnnotations || []
    const species = labels.find(label => 
      ANIMAL_LABELS.includes(label.description.toLowerCase())
    )?.description || 'unknown'
    console.log('Detected species:', species)

    const registryId = await publishAnimalRecord(
      species.toLowerCase(),
      coordinates.lat,
      coordinates.lng,
      visionDescription,
      ipfsUrl,
      process.env.NEXT_PUBLIC_PORTAL_NAME
    )

    console.log('Published animal record to Laconic Registry:', registryId)
    return registryId
  } catch (error) {
    console.error('Failed to process animal image:', error)
    throw error
  }
}
