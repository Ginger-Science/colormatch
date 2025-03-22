// src/services/pinataService.ts

interface PinataResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export async function uploadToIpfs(imageBuffer: Buffer, filename: string): Promise<string> {
  try {
    const jwt = process.env.PINATA_JWT
    const baseUrl = process.env.PINATA_BASE_URL

    if (!jwt || !baseUrl) {
      throw new Error('Pinata configuration missing')
    }

    // Use native FormData creation
    const formData = new FormData()
    
    // Create file from buffer 
    // Use File instead of Blob for better compatibility
    const file = new File([imageBuffer], filename, { type: 'image/jpeg' })
    formData.append('file', file, filename)

    // Add metadata
    const pinataMetadata = JSON.stringify({
      name: filename,
    })
    formData.append('pinataMetadata', pinataMetadata)

    // Add options
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    })
    formData.append('pinataOptions', pinataOptions)

    console.log('Uploading to Pinata:', {
      filename,
      size: imageBuffer.length
    })

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      body: formData,
    })

    console.log('Pinata response status:', response.status)
    const data = await response.json()
    console.log('Pinata response:', data)

    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.status} - ${JSON.stringify(data)}`)
    }

    const ipfsUrl = `${baseUrl}/ipfs/${data.IpfsHash}`
    console.log('Uploaded to IPFS:', ipfsUrl)
    return ipfsUrl

  } catch (error) {
    console.error('IPFS upload failed:', error)
    throw error
  }
}
