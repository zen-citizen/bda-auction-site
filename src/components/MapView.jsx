import { useMemo, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { normalizeLayoutName } from '../lib/utils'
import './MapView.css'

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Component to handle map control (zoom/pan when site is selected)
function MapController({ selectedSite }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedSite?.hasCoordinates) return

    const currentZoom = map.getZoom()
    const position = [selectedSite.lat, selectedSite.lng] // Leaflet uses [lat, lng]

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
  }, [selectedSite, map])

  return null
}

// Component for individual site marker
function SiteMarker({ site, onSiteSelect, filters, selectedSite }) {
  const normalizedLayout = normalizeLayoutName(site.layout)
  const markerRef = useRef(null)
  const tooltipRef = useRef(null)
  
  // Check if marker should be visible based on filters
  const shouldShow = useMemo(() => {
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      if (!site.siteNo.toLowerCase().includes(searchLower) && 
          !site.layout.toLowerCase().includes(searchLower)) {
        return false
      }
    }
    if (filters?.layout && normalizedLayout !== filters.layout) {
      return false
    }
    if (filters?.siteSize) {
      const area = parseFloat(site.totalArea) || 0
      if (filters.siteSize === "0-600" && (area < 0 || area >= 600)) return false
      if (filters.siteSize === "600-1200" && (area < 600 || area >= 1200)) return false
      if (filters.siteSize === "1200-2400" && (area < 1200 || area >= 2400)) return false
      if (filters.siteSize === ">2400" && area < 2400) return false
    }
    if (filters?.biddingSession && site.biddingSession.toString() !== filters.biddingSession) {
      return false
    }
    return true
  }, [filters, site, normalizedLayout])


  if (!shouldShow) {
    return null
  }

  const position = [site.lat, site.lng] // Leaflet uses [lat, lng]

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

function MapView({ sites, selectedSite, onSiteSelect, filters }) {
  // Center on Bangalore - Leaflet uses [lat, lng]
  const defaultCenter = [12.9716, 77.5946]
  const defaultZoom = 11
  
  // Restrict map bounds to Bangalore region to prevent panning outside
  // Bounds: [southwest corner, northeast corner]
  const maxBounds = [
    [12.5, 77.0],  // Southwest corner (south of Bangalore)
    [13.5, 78.0]   // Northeast corner (north of Bangalore)
  ]

  // Filter sites with coordinates
  const sitesWithCoords = useMemo(() => {
    return sites.filter(site => site.hasCoordinates)
  }, [sites])

  return (
    <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
        scrollWheelZoom={true}
        zoomControl={false}
        whenReady={() => {
          // Map is ready
        }}
      >
      <ZoomControl position="topright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        tileSize={256}
        zoomOffset={0}
        errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />
      
      <MapController selectedSite={selectedSite} />
      
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
