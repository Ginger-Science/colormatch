'use client'

import React from 'react'
import Image from 'next/image'
import ImageAnalysisCard from '../components/ImageAnalysisCard'
import Navigation from '../components/Navigation'
import { analyzeImage, VisionAnalysisResult, VISION_CONFIG } from '../services/googleVisionService'
import { APP_CONFIG, getThemeColors } from '../config/appConfig'
import { normalizeImageUpload } from '../services/imageService'

const Page: React.FC = (): React.ReactElement => {

  const theme = getThemeColors(APP_CONFIG.theme)

  const handleImageAnalysis = () => {
    return async (imageFile: File): Promise<VisionAnalysisResult> => {
      try {
        const normalizedImage = await normalizeImageUpload(imageFile)
        const arrayBuffer = await normalizedImage.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const result = await analyzeImage(buffer, normalizedImage.name)
        return result
      } catch (error) {
        console.error('Image analysis error:', error)
        throw error
      }
    }
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center bg-gradient-to-b ${theme.gradient}`}>
      
      {/* Navbar outside container */}
      <div className="w-full">
        <Navigation />
      </div>

      {/* Hero Image and Content Container */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Image */}
        <div className="relative w-full h-[400px] mx-auto mb-8">
          <Image
            src="/assets/bg.png"
            alt="Ginger Science Hero"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="text-center mb-8 pt-4">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 text-${theme.primary}-400`}>
            {APP_CONFIG.title}
          </h1>
          <p className={`text-${theme.text}-200 text-lg mb-8`}>
            Document sightings of {APP_CONFIG.description} in {APP_CONFIG.location}
          </p>
        </div>

        {/* Single Analysis Card */}
        <div className="max-w-2xl mx-auto relative">
          <div className={`absolute -top-4 -left-4 w-8 h-8 bg-${theme.primary}-500/10 rounded-full blur-lg`} />
          <div className={`absolute -bottom-4 -right-4 w-8 h-8 bg-${theme.secondary}-500/10 rounded-full blur-lg`} />

          <ImageAnalysisCard
            title={VISION_CONFIG.name}
            description={VISION_CONFIG.description}
            onAnalyze={handleImageAnalysis()}
          />
        </div>

        {/* Info Section */}
        <div className={`mt-12 text-center text-${theme.primary}-300/60`}>
          <p className="text-sm">
            Built by <a href="https://gingerscience.org/">Ginger Science</a> - Powered by <a href="https://laconic.com">Laconic</a> & <a href="https://mito.systems/">Mito Systems</a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Page
