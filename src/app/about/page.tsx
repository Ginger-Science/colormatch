'use client'

import React from 'react'
import Navigation from '../../components/Navigation'


const AboutPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-amber-950 via-orange-400 to-amber-950">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Navigation />
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4  bg-clip-text bg-gradient-to-r from-amber-400 to-amber-100">
            About
          </h1>
          <p className="text-amber-200 text-lg">
            Exploring global phenotype variations associated with MC1R gene variants
          </p>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto bg-amber-900/20 rounded-xl p-8 border border-amber-800/50">
          <div className="flex items-center justify-center mb-6">
            
          </div>
          
          <div className="space-y-6 text-amber-200">
            <p>
              Ginger Science combines citizen science, artificial intelligence, and blockchain to study variations in phenotype expression of MC1R gene variants worldwide.
            </p>

            <p> 
              Using advanced image recognition and decentralized storage, we create secure, verifiable records of phenotype variations that provide invaluable data for researchers studying genetics, dermatology, and personalized medicine.
            </p>

            <p>     
              Each image submitted is analyzed by AI to identify and document specific ginger phenotypes, with data securely stored on blockchain technology, creating an immutable, transparent archive for scientific analysis.
            </p>

            <p>
              This project is currently in development; precise location data is randomized to preserve user privacy. Future updates will integrate verifiable yet privacy-preserving location methods.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center text-white-300/60">
          <p className="text-sm">
            Built by <a href="https://gingerscience.org/">Ginger Science</a> - Powered by <a href="https://laconic.com">Laconic</a> & <a href="https://mito.systems/">Mito Systems</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage