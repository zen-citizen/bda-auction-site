import JSZip from 'jszip'
import toGeoJSON from '@mapbox/togeojson'

/**
 * Parses a KMZ file (compressed KML) and converts it to GeoJSON
 * @param {File|Blob|ArrayBuffer} file - The KMZ file to parse
 * @returns {Promise<Object>} GeoJSON feature collection
 */
export async function parseKMZ(file) {
  try {
    // Load the KMZ file
    const zip = await JSZip.loadAsync(file)
    
    // Find the KML file in the archive (usually named 'doc.kml' or similar)
    const kmlFiles = Object.keys(zip.files).filter(name => {
      const file = zip.files[name]
      return !file.dir && /\.kml$/i.test(name)
    })
    
    if (kmlFiles.length === 0) {
      throw new Error('No KML file found in KMZ archive')
    }
    
    // Use the first KML file found (usually 'doc.kml')
    const kmlFile = zip.files[kmlFiles[0]]
    
    // Extract and parse the KML content
    const kmlText = await kmlFile.async('string')
    const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml')
    
    // Check for parsing errors
    const parserError = kmlDom.querySelector('parsererror')
    if (parserError) {
      throw new Error('Failed to parse KML XML: ' + parserError.textContent)
    }
    
    // Convert KML to GeoJSON
    const geoJson = toGeoJSON.kml(kmlDom)
    
    return geoJson
  } catch (error) {
    throw error
  }
}

/**
 * Parses a KML file (uncompressed) and converts it to GeoJSON
 * @param {string} kmlText - The KML XML content as a string
 * @returns {Object} GeoJSON feature collection
 */
export function parseKML(kmlText) {
  try {
    const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml')
    
    // Check for parsing errors
    const parserError = kmlDom.querySelector('parsererror')
    if (parserError) {
      throw new Error('Failed to parse KML XML: ' + parserError.textContent)
    }
    
    // Convert KML to GeoJSON
    const geoJson = toGeoJSON.kml(kmlDom)
    
    return geoJson
  } catch (error) {
    throw error
  }
}
