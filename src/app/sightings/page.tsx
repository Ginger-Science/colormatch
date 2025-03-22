// src/app/sightings/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { fetchAnimalRecords } from '../../services/laconicQueryService'
import Navigation from '../../components/Navigation'
import { AnimalRecord } from '../../types/records'
import { APP_CONFIG, getThemeColors } from '../../config/appConfig'


const hiddenIndices = (process.env.NEXT_PUBLIC_HIDDEN_INDICES?.split(',') || [])
  .map(num => parseInt(num))
  .filter(num => !isNaN(num))

export default function AnimalsPage() {
  const [records, setRecords] = useState<AnimalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAnimalRecords(APP_CONFIG.recordEnv)

      // Sort by creation time, oldest first
      const sortedRecords = [...data].sort((a, b) => 
        new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      )

      // Filter out records by their chronological index (1-based)
      const filteredRecords = sortedRecords.filter((_, index) => 
        !hiddenIndices.includes(index + 1)
      )

      // Reverse to show newest first
      setRecords(filteredRecords.reverse())
    } catch (error) {
      setError('Failed to load image')
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-amber-200 text-center">
          Loading Ginger Science records...
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-xl">
          {error}
        </div>
      )
    }

    if (records.length === 0) {
      return (
        <div className="text-amber-200 text-center p-8 bg-amber-900/20 rounded-xl">
          No Ginger Sightings found yet. Be the first to contribute!
        </div>
      )
    }

    return (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record, index) => (
              <div
                key={`${record.id}-${index}`}
                className="bg-amber-900/20 rounded-xl p-6 border border-amber-800/50 hover:border-amber-700/50 transition-colors"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-amber-900/50">
                  <img
                    src={record.attributes?.imageUrl}
                    alt={`Wildlife sighting`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold text-amber-300 capitalize mb-2">
                  {record.attributes?.mainObject}
                </h3>

                <div className="flex items-center text-amber-200/80 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {record.attributes?.location.latitude}°, {record.attributes?.location.longitude}°
                  </span>
                </div>

                <p className="text-amber-200 text-sm">
                  {record.attributes?.description}
                </p>
	    </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-amber-950 via-green-900 to-amber-950">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Navigation />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-teal-300">
            {APP_CONFIG.title}
          </h1>
          <p className="text-amber-200 text-lg mb-8">
            Discover sightings from our community
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
