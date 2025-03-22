// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageWithVision } from '../../../services/googleVisionCore'
import { processAnimalImage } from '../../../services/animalProcessingService'

// Increase body parser size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Log incoming request details
    console.log('Incoming request:', {
      method: req.method,
      contentType: req.headers.get('content-type'),
      contentLength: req.headers.get('content-length')
    })

    // Parse form data
    const formData = await req.formData()
    const imageFile = formData.get('image')
    
    // More explicit type checking and conversion
    const file = imageFile instanceof File 
      ? imageFile 
      : (Array.isArray(imageFile) ? imageFile[0] : null)
    
    // Validate image file
    if (!file) {
      console.error('Invalid file upload:', { 
        imageFile: imageFile ? 'Exists' : 'Not found',
        type: imageFile ? typeof imageFile : 'undefined'
      })
      
      return NextResponse.json(
        { error: 'No valid image provided' },
        { status: 400 }
      )
    }

    // Log file details
    console.log('Uploaded file details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Convert image to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Log buffer details
    console.log('Buffer details:', {
      bufferLength: buffer.length
    })

    // Validate buffer size
    const MAX_BUFFER_SIZE = 10 * 1024 * 1024 // 10MB
    if (buffer.length > MAX_BUFFER_SIZE) {
      console.error('Buffer too large:', {
        bufferLength: buffer.length,
        maxAllowedSize: MAX_BUFFER_SIZE
      })
      
      return NextResponse.json(
        { error: 'Image file is too large' },
        { status: 413 }
      )
    }

    // Analyze image
    const visionResult = await analyzeImageWithVision(buffer)

    // Construct response message
    const responseMessage = `${visionResult.description}\n\n${
      visionResult.isAnimal 
        ? "✨ This image contains wildlife and has been added to our registry! Thank you for contributing to our wildlife database."
        : "🌿 No wildlife detected in this image. Try uploading a photo of an animal!"
    }`

    // Prepare user response
    const userResponse = NextResponse.json({ 
      description: responseMessage,
      isAnimal: visionResult.isAnimal
    })

    // Background processing for animal images
    if (visionResult.isAnimal) {
      processAnimalImage(
        buffer,
        visionResult.description,
        visionResult.rawResponse,
        file.name
      ).catch(console.error)
    }

    return userResponse

  } catch (error) {
    // Comprehensive error logging
    console.error('Analysis failed:', {
      errorName: error instanceof Error ? error.name : 'Unknown Error',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : 'No stack trace'
    })

    // Return user-friendly error response
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}

// Ensure dynamic routing
export const dynamic = 'force-dynamic'
