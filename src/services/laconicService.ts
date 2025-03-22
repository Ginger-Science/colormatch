import { promises as fs } from 'fs'
import yaml from 'yaml'
import axios from 'axios'

interface LaconicAnimalRecord {
  record: {
    type: 'AnimalRecord'
    mainObject: string
    location: {
      latitude: number
      longitude: number
    }
    description: string
    imageUrl: string
    portalName: string
  }
}

export async function publishAnimalRecord(
  mainObject: string,
  latitude: number,
  longitude: number,
  description: string,
  imageUrl: string,
  portalName: string
): Promise<string> {
  try {
    const record: LaconicAnimalRecord = {
      record: {
        type: 'AnimalRecord',
        mainObject,
        location: {
          latitude,
          longitude
        },
        description,
        imageUrl,
        portalName
      }
    }

    const response = await axios.post('http://143.198.37.25:3000/publishRecord', {
      yamlContent: yaml.stringify(record)
    }, {
      headers: {
        'Authorization': `Bearer 1234`, //${process.env.LACONIC_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.output

  } catch (error) {
    console.error('Failed to publish animal record:', error)
    throw error
  }
}
