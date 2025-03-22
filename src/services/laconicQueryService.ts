// src/services/laconicQueryService.ts

import { AnimalRecord } from '../types/records'

const LACONIC_GQL_ENDPOINT = process.env.NEXT_PUBLIC_LACONIC_GQL_ENDPOINT

const ANIMAL_RECORDS_QUERY = `
  query GetAnimalRecords($portalName: String!) {
    queryRecords(
      attributes: [
        { key: "type", value: { string: "AnimalRecord" } },
	{ key: "portalName", value: { string: $portalName } }
      ],
      all: true
    ) {
      id
      names
      bondId
      createTime
      expiryTime
      owners
      attributes {
        key
        value {
          ... on StringValue {
            string: value
          }
          ... on IntValue {
            int: value
          }
          ... on FloatValue {
            float: value
          }
          ... on StringValue {
            string: value
          }
        }
      }
    }
  }
`

export async function fetchAnimalRecords(portalName: string): Promise<AnimalRecord[]> {
  try {
    const response = await fetch(LACONIC_GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ANIMAL_RECORDS_QUERY,
	variables: { portalName: process.env.NEXT_PUBLIC_PORTAL_NAME }
      }),
    })
    
    console.log('GQL_endpoint', LACONIC_GQL_ENDPOINT)

    const data = await response.json()

    console.log('Full response data:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error('Failed to fetch animal records');
    }

    // Transform the response into our AnimalRecord format
    const records = data.data.queryRecords
      .map((record: any) => {
        // Convert attributes to a map
        const attributesMap = record.attributes.reduce((acc: any, attr: any) => {
          acc[attr.key] = attr.value.string || attr.value.int || attr.value.float;
          return acc;
        }, {});

        // Safely parse location
        let location = { latitude: 0, longitude: 0 };
        try {
          location = JSON.parse(attributesMap.location || '{}');
        } catch (parseError) {
          console.error('Error parsing location:', parseError);
        }

        return {
          id: record.id,
          attributes: {
            mainObject: attributesMap.mainObject || 'Unknown',
            location: {
              latitude: location.latitude || 0,
              longitude: location.longitude || 0
            },
            description: attributesMap.description || 'No description',
            imageUrl: attributesMap.imageUrl || null,
	    portalName: attributesMap.portalName || null
          },
          createTime: record.createTime || ''
        }
      })
      // Filter out records without an imageUrl or non matching portalName
      .filter((record: AnimalRecord) =>
  	record.attributes.imageUrl !== null &&
  	record.attributes.imageUrl.trim() !== '' &&
  	record.attributes.portalName === process.env.NEXT_PUBLIC_PORTAL_NAME
      );

    console.log('Processed animal records:', records);

    return records;
  } catch (error) {
    console.error('Error fetching animal records:', error)
    throw error
  }
}
