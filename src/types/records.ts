// src/types/records.ts

export interface AnimalRecord {
  id: string
  attributes: {
    mainObject: string
    location: {
      latitude: number
      longitude: number
    }
    description: string
    imageUrl: string
    portalName: string
  }
  bondId?: string
  createTime: string
}
