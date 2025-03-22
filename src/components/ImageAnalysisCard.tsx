// src/components/ImageAnalysisCard.tsx
'use client'

import React, { useState, useRef } from 'react'
import { APP_CONFIG } from '../config/appConfig'


interface ImageAnalysisCardProps {
  title: string
  description: string
  onAnalyze: (file: File) => Promise<{ description?: string, error?: string }>
}

interface AnalysisState {
  loading: boolean
  imageUrl: string | null
  description: string | null
  error: string | null
}

const ImageAnalysisCard: React.FC<ImageAnalysisCardProps> = ({
  title,
  description,
  onAnalyze
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    loading: false,
    imageUrl: null,
    description: null,
    error: null,
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setAnalysisState({
        ...analysisState,
        imageUrl,
        description: null,
        error: null
      })
    }
  }

  const handleAnalyze = async () => {
    const file = fileInputRef.current?.files?.[0]

    if (!file) return

    setAnalysisState({
      ...analysisState,
      loading: true,
      error: null,
    })

    try {
      const result = await onAnalyze(file)
      
      if (result.error) {
        setAnalysisState({
          ...analysisState,
          loading: false,
          error: result.error,
        })
        return
      }

      if (result.description) {
        setAnalysisState({
          loading: false,
          imageUrl: analysisState.imageUrl,
          description: result.description,
          error: null,
        })
      } else {
        throw new Error('No analysis received')
      }
    } catch (error) {
      setAnalysisState({
        ...analysisState,
        loading: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      })
    }
  }

  return (
    <div className="w-full bg-amber-900/20 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-800/50 mb-8 hover:shadow-amber-500/20 transition-all duration-300">
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            
            <h2 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600-300">
              {title}
            </h2>
          </div>
          <p className="text-white mt-2">{description}</p>
        </div>

        <div className="space-y-4">
          {/* Image Upload Area */}
          <div 
            className="relative border-2 border-dashed border-amber-800/50 rounded-xl p-4 text-center
                       hover:border-amber-500/50 transition-colors duration-200
                       bg-amber-950/30"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer
                       disabled:cursor-not-allowed"
            />
            <div className="space-y-2">
              <div className="text-amber-300">
                {analysisState.imageUrl ? (
                  <img 
                    src={analysisState.imageUrl} 
                    alt="Selected" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <p>Share pictures of {APP_CONFIG.description}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analysisState.loading || !analysisState.imageUrl}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 
                     hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl 
                     transition-all duration-200 shadow-lg hover:shadow-amber-500/25 
                     disabled:opacity-100 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {analysisState.loading ? 'Processing...' : 'Analyze' }
          </button>
        </div>

        {analysisState.error && (
          <div className="mt-4 bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center">
            {analysisState.error}
          </div>
        )}

        {analysisState.description && (
          <div className="mt-4 bg-orange-900/30 border border-amber-800/50 rounded-xl p-4">
            <p className="text-amber-200 whitespace-pre-wrap">{analysisState.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageAnalysisCard
