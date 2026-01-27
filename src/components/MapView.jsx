import { useMemo, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap, ZoomControl, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { normalizeLayoutName } from '../lib/utils'
import { parseKMZ } from '../lib/kmlParser'
import './MapView.css'

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Component to handle map control (zoom/pan when site is selected)
function MapController({ selectedSite, isResizingRef }) {
  const map = useMap()

  // Helper function to check if map container is visible and has valid dimensions
  const isMapReadyForAnimation = () => {
    try {
      const container = map.getContainer()
      if (!container) return false
      
      // Check if container is visible and has valid dimensions
      // offsetWidth/offsetHeight are 0 when element is hidden (display: none) or has no size
      const hasValidDimensions = container.offsetWidth > 0 && container.offsetHeight > 0
      
      // Also check computed style to ensure it's not hidden
      const style = window.getComputedStyle(container)
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden'
      
      return hasValidDimensions && isVisible
    } catch (error) {
      // If we can't check, assume map is not ready
      return false
    }
  }

  useEffect(() => {
    if (!selectedSite?.hasCoordinates) return

    const lat = selectedSite.lat
    const lng = selectedSite.lng
    
    // Validate coordinates are valid finite numbers
    if (lat == null || lng == null || 
        Number.isNaN(lat) || Number.isNaN(lng) || 
        !Number.isFinite(lat) || !Number.isFinite(lng) ||
        typeof lat !== 'number' || typeof lng !== 'number') {
      return
    }

    // Validate coordinates are within valid ranges (latitude: -90 to 90, longitude: -180 to 180)
    // For Bangalore region, we expect roughly lat: 12-13, lng: 77-78
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return
    }

    // Don't animate if map is currently resizing
    if (isResizingRef?.current) {
      return
    }

    // Check if map container is visible and has valid dimensions before attempting animation
    if (!isMapReadyForAnimation()) {
      return
    }

    const currentZoom = map.getZoom()
    const position = [lat, lng] // Leaflet uses [lat, lng]

    // Add a small delay to ensure map is stable before animating
    const timer = setTimeout(() => {
      // Check again if resize started during delay
      if (isResizingRef?.current) {
        return
      }

      // Check again if map is still ready (dimensions might have changed)
      if (!isMapReadyForAnimation()) {
        return
      }

      try {
        // Only zoom if we're zoomed out, otherwise just pan smoothly
        if (currentZoom < 13) {
          map.flyTo(position, 14, {
            duration: 1.5, // seconds
            easeLinearity: 0.25
          })
        } else {
          // Just pan if already zoomed in
          map.flyTo(position, currentZoom, {
            duration: 0.8,
            easeLinearity: 0.25
          })
        }
      } catch (error) {
        // Silently handle animation errors (e.g., if map is being destroyed)
        console.warn('Map animation error:', error)
      }
    }, 100) // Small delay to avoid race conditions

    return () => clearTimeout(timer)
  }, [selectedSite, map, isResizingRef])

  return null
}

// Component to handle map resize when container size changes
function MapResizeHandler({ mapExpanded, isResizingRef }) {
  const map = useMap()
  const clearTimerRef = useRef(null)

  useEffect(() => {
    // Set resize flag to prevent animations during resize
    if (isResizingRef) {
      isResizingRef.current = true
    }

    // Clear any existing clearTimer from previous effect run
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current)
      clearTimerRef.current = null
    }

    // Small delay to ensure CSS transition completes
    const timer = setTimeout(() => {
      try {
        map.invalidateSize()
      } catch (error) {
        console.warn('Map resize error:', error)
      }
      
      // Clear resize flag after a short delay to allow map to stabilize
      clearTimerRef.current = setTimeout(() => {
        if (isResizingRef) {
          isResizingRef.current = false
        }
        clearTimerRef.current = null
      }, 100)
    }, 350) // Slightly longer than CSS transition (300ms)

    return () => {
      clearTimeout(timer)
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current)
        clearTimerRef.current = null
      }
      // Ensure flag is cleared on unmount
      if (isResizingRef) {
        isResizingRef.current = false
      }
    }
  }, [mapExpanded, map, isResizingRef])

  return null
}

// Component for individual site marker
function SiteMarker({ site, onSiteSelect, filters, selectedSite }) {
  // Extract first part of layoutDetails before comma and normalize
  const firstPart = site.layoutDetails?.split(',')[0].trim() || ''
  const normalizedLayout = normalizeLayoutName(firstPart)
  const markerRef = useRef(null)
  const tooltipRef = useRef(null)
  
  // Check if marker should be visible based on filters
  const shouldShow = useMemo(() => {
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      if (!site.siteNo.toLowerCase().includes(searchLower) && 
          !site.layout.toLowerCase().includes(searchLower) &&
          !(site.layoutDetails && site.layoutDetails.toLowerCase().includes(searchLower))) {
        return false
      }
    }
    if (filters?.layout && normalizedLayout !== filters.layout) {
      return false
    }
    if (filters?.siteSize) {
      if (site.sizeClassification !== filters.siteSize) return false
    }
    if (filters?.biddingSession && site.biddingSession.toString() !== filters.biddingSession) {
      return false
    }
    return true
  }, [filters, site, normalizedLayout])


  if (!shouldShow) {
    return null
  }

  // Validate coordinates before creating position array
  const lat = site.lat
  const lng = site.lng
  
  // Ensure coordinates are valid finite numbers within valid ranges
  if (lat == null || lng == null || 
      Number.isNaN(lat) || Number.isNaN(lng) || 
      !Number.isFinite(lat) || !Number.isFinite(lng) ||
      typeof lat !== 'number' || typeof lng !== 'number' ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    // Don't render marker if coordinates are invalid
    return null
  }

  const position = [lat, lng] // Leaflet uses [lat, lng]

  // Create custom icon with smaller size and reduced shadow
  const customIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [0, -30],
    shadowSize: [25, 25]
  })

  const popupContent = (
    <div className="marker-tooltip">
      <strong>Sl.No #{site.slNo}</strong>
      <div className="tooltip-site-no">Site No: {site.siteNo}</div>
      <div>{site.layoutDetails || site.layout}</div>
      <div>Total Area: {site.totalArea} sq.m</div>
      <div className="tooltip-hint">Click for details</div>
    </div>
  )

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          // Close tooltip before opening modal
          if (tooltipRef.current?.leafletElement) {
            tooltipRef.current.leafletElement.close()
          }
          // Also cleanup from DOM
          if (markerRef.current?.leafletElement?._map) {
            const tooltipPane = markerRef.current.leafletElement._map.getPane('tooltipPane')
            if (tooltipPane) {
              const tooltips = tooltipPane.querySelectorAll('.leaflet-tooltip')
              tooltips.forEach(tt => tt.remove())
            }
          }
          onSiteSelect(site)
        }
      }}
    >
      <Tooltip 
        ref={tooltipRef}
        permanent={false}
        direction="top" 
        offset={[0, -15]}
      >
        {popupContent}
      </Tooltip>
    </Marker>
  )
}

function MapView({ sites, selectedSite, onSiteSelect, filters, mapViewMode = 'street', mapExpanded = false }) {
  // Center on Bangalore - Leaflet uses [lat, lng]
  const defaultCenter = [12.9716, 77.5946]
  const defaultZoom = 12
  
  // Restrict map bounds to Bangalore region to prevent panning outside
  // Bounds: [southwest corner, northeast corner]
  const maxBounds = [
    [12.5, 77.0],  // Southwest corner (south of Bangalore)
    [13.5, 78.0]   // Northeast corner (north of Bangalore)
  ]

  // Ref to track if map is currently resizing (prevents race conditions with animations)
  const isResizingRef = useRef(false)

  // State for KML boundaries (site boundaries)
  const [boundaries, setBoundaries] = useState(null)
  const [boundariesError, setBoundariesError] = useState(null)
  
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size for responsive attribution
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load and parse KML boundaries on component mount
  // Note: kml.kmz file should be placed in the public/ folder for Vite to serve it
  useEffect(() => {
    const loadBoundaries = async () => {
      try {
        const response = await fetch('/kml.kmz')
        if (!response.ok) {
          throw new Error(`Failed to fetch KML file: ${response.statusText}`)
        }
        const blob = await response.blob()
        const geoJson = await parseKMZ(blob)
        
        if (geoJson && geoJson.features && geoJson.features.length > 0) {
          setBoundaries(geoJson)
        } else {
          setBoundariesError('KML file contains no boundary features')
        }
      } catch (error) {
        setBoundariesError(error.message)
      }
    }

    loadBoundaries()
  }, [])

  // Filter sites with coordinates
  const sitesWithCoords = useMemo(() => {
    return sites.filter(site => site.hasCoordinates)
  }, [sites])

  const tileConfig = useMemo(() => {
    if (mapViewMode === 'satellite') {
      // Use shorter attribution text on mobile
      const attribution = isMobile 
        ? 'Tiles &copy; Esri'
        : 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
      
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution,
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 0,
      }
    }
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
    }
  }, [mapViewMode, isMobile])

  // Style function for site boundaries (from KML) - WHITE stroke
  const siteBoundaryStyle = (feature) => {
    return {
      color: '#ffffff',
      weight: 3,
      opacity: 0.9,
      fillColor: '#ffffff',
      fillOpacity: 0.3,
      dashArray: feature?.geometry?.type === 'LineString' ? '5, 5' : undefined,
    }
  }

  return (
    <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        className={`map-container ${mapViewMode === 'satellite' ? 'satellite-view' : ''}`}
        scrollWheelZoom={true}
        zoomControl={false}
        whenReady={() => {
          // Map is ready
        }}
      >
      <ZoomControl position="topright" />
      <TileLayer
        attribution={tileConfig.attribution}
        url={tileConfig.url}
        maxZoom={tileConfig.maxZoom}
        tileSize={tileConfig.tileSize}
        zoomOffset={tileConfig.zoomOffset}
        errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />
      
      {/* Render KML boundaries (site boundaries) if loaded */}
      {boundaries && boundaries.features && boundaries.features.length > 0 && (
        <GeoJSON
          key="kml-site-boundaries"
          data={boundaries}
          style={siteBoundaryStyle}
          onEachFeature={(feature, layer) => {
            // Optional: Add popup or interaction
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(`Site Boundary: ${feature.properties.name}`)
            }
          }}
        />
      )}
      
      <MapController selectedSite={selectedSite} isResizingRef={isResizingRef} />
      <MapResizeHandler mapExpanded={mapExpanded} isResizingRef={isResizingRef} />
      
      {sitesWithCoords.map(site => (
        <SiteMarker
          key={site.slNo}
          site={site}
          onSiteSelect={onSiteSelect}
          filters={filters}
          selectedSite={selectedSite}
        />
      ))}
    </MapContainer>
  )
}

export default MapView
