import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import MapView from '../components/MapView'
import SiteFilters from '../components/SiteFilters'
import SiteList from '../components/SiteList'
import SiteDetailsModal from '../components/SiteDetailsModal'
import SelectMarkerIcon from '../components/icons/SelectMarkerIcon'
import sitesData from '../data/sites.json'
import { normalizeLayoutName } from '../lib/utils'
import './MapPage.css'

function MapPage() {
  const [filters, setFilters] = useState({
    search: '',
    layout: '',
    siteSize: '',
    biddingSession: '',
  })
  const [selectedSite, setSelectedSite] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [mapViewMode, setMapViewMode] = useState('satellite')
  const [mapState, setMapState] = useState('default') // 'default' | 'expanded' | 'collapsed'
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const dragStartStateRef = useRef('default') // Track state when drag begins

  const { sites } = sitesData

  // Extract unique normalized layout names
  const normalizedLayouts = useMemo(() => {
    const normalized = new Set()
    sites.forEach(site => {
      const base = normalizeLayoutName(site.layout)
      if (base) normalized.add(base)
    })
    return Array.from(normalized).sort()
  }, [sites])

  // Bidding session options
  const biddingSessions = [
    { value: "1", label: "Round 1: 16-17 Feb 2026" },
    { value: "2", label: "Round 2: 17-18 Feb 2026" }
  ]

  const filteredAndSortedSites = useMemo(() => {
    let filtered = [...sites]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(site =>
        site.siteNo.toLowerCase().includes(searchLower) ||
        site.layout.toLowerCase().includes(searchLower)
      )
    }

    // Apply layout filter using normalized names
    if (filters.layout) {
      filtered = filtered.filter(site => 
        normalizeLayoutName(site.layout) === filters.layout
      )
    }

    // Apply site size filter (using size classification from CSV)
    if (filters.siteSize) {
      filtered = filtered.filter(site => {
        return site.sizeClassification === filters.siteSize
      })
    }

    // Apply bidding session filter
    if (filters.biddingSession) {
      filtered = filtered.filter(site => site.biddingSession.toString() === filters.biddingSession)
    }

    // Default sorting by serial number
    filtered.sort((a, b) => a.slNo - b.slNo)

    return filtered
  }, [sites, filters])

  // Calculate visible sites count (sites with coordinates that pass filters)
  const visibleSitesCount = useMemo(() => {
    return filteredAndSortedSites.filter(site => site.hasCoordinates).length
  }, [filteredAndSortedSites])

  const totalSites = sites.length

  // Detect mobile screen size and set default collapsed state
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setFiltersExpanded(false)
      } else {
        setFiltersExpanded(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.layout) count++
    if (filters.siteSize) count++
    if (filters.biddingSession) count++
    return count
  }, [filters])

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleSiteSelect = (site) => {
    setSelectedSite(site)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedSite(null)
  }

  // Drag handle handlers for mobile map expansion
  const handleDragStart = (e) => {
    if (window.innerWidth > 768) return // Only on mobile
    const touch = e.touches ? e.touches[0] : e
    dragStartStateRef.current = mapState // Capture current state when drag begins
    setIsDragging(true)
    setDragStartY(touch.clientY)
    setDragCurrentY(touch.clientY)
    // Note: preventDefault not needed here - CSS touch-action: none handles it
  }

  // Prevent scrolling during drag and add global listeners
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      
      const handleGlobalTouchMove = (e) => {
        if (window.innerWidth > 768) return
        const touch = e.touches ? e.touches[0] : e
        setDragCurrentY(touch.clientY)
        e.preventDefault()
        e.stopPropagation()
      }
      
      const handleGlobalTouchEnd = (e) => {
        if (window.innerWidth > 768) return
        
        const dragDistance = dragStartY - dragCurrentY
        const absDistance = Math.abs(dragDistance)
        const minDragDistance = 30 // Minimum to trigger any change
        const halfwayThreshold = window.innerHeight * 0.5 // 50% of viewport height
        
        if (absDistance < minDragDistance) {
          // Not enough movement, stay in current state
          setIsDragging(false)
          setDragStartY(0)
          setDragCurrentY(0)
          return
        }

        const dragStartState = dragStartStateRef.current

        if (dragStartState === 'default') {
          // From default: down = expanded, up = collapsed
          if (dragDistance > 0) {
            setMapState('expanded')  // Dragged down → map expands
          } else {
            setMapState('collapsed')  // Dragged up → map collapses
          }
        } else if (dragStartState === 'expanded') {
          // From expanded: up a little = default, up more = collapsed
          if (dragDistance < 0) {  // Dragged up
            if (absDistance < halfwayThreshold) {
              setMapState('default')
            } else {
              setMapState('collapsed')
            }
          }
          // Dragging down from expanded does nothing (already at top)
        } else if (dragStartState === 'collapsed') {
          // From collapsed: down a little = default, down more = expanded
          if (dragDistance > 0) {  // Dragged down
            if (absDistance < halfwayThreshold) {
              setMapState('default')
            } else {
              setMapState('expanded')
            }
          }
          // Dragging up from collapsed does nothing (already at bottom)
        }
        
        setIsDragging(false)
        setDragStartY(0)
        setDragCurrentY(0)
        
        if (e) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false })
      
      return () => {
        document.body.style.overflow = ''
        document.body.style.touchAction = ''
        document.removeEventListener('touchmove', handleGlobalTouchMove)
        document.removeEventListener('touchend', handleGlobalTouchEnd)
      }
    }
  }, [isDragging, dragStartY, dragCurrentY])

  return (
    <div className="map-page">
      <div className="map-page-filters">
        <button
          className="filters-toggle-mobile"
          onClick={toggleFilters}
          aria-expanded={filtersExpanded}
          aria-label="Toggle filters"
        >
          <span className="filters-toggle-label">
            Filters
            {activeFiltersCount > 0 && (
              <span className="filters-count-badge">{activeFiltersCount}</span>
            )}
          </span>
          {filtersExpanded ? (
            <ChevronUp className="filters-toggle-icon" size={20} />
          ) : (
            <ChevronDown className="filters-toggle-icon" size={20} />
          )}
        </button>
        <div className={`filters-content ${filtersExpanded ? 'expanded' : 'collapsed'}`}>
          <SiteFilters
            layouts={normalizedLayouts}
            biddingSessions={biddingSessions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      <div className={`map-page-content ${mapState === 'expanded' ? 'map-expanded' : mapState === 'collapsed' ? 'map-collapsed' : ''}`}>
        {/* Desktop sidebar - unchanged */}
        <div className="map-page-sidebar">
          <SiteList
            sites={filteredAndSortedSites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
            mapViewMode={mapViewMode}
            setMapViewMode={setMapViewMode}
          />
        </div>

        {/* Desktop map - unchanged */}
        <div className={`map-page-map ${mapState === 'expanded' ? 'expanded' : ''}`}>
          <div className="map-page-header">
            <div className="map-view-toggle" role="group" aria-label="Map view mode">
              <button
                type="button"
                className={`map-view-toggle-button ${mapViewMode === 'street' ? 'active' : ''}`}
                onClick={() => setMapViewMode('street')}
                aria-pressed={mapViewMode === 'street'}
              >
                Map
              </button>
              <button
                type="button"
                className={`map-view-toggle-button ${mapViewMode === 'satellite' ? 'active' : ''}`}
                onClick={() => setMapViewMode('satellite')}
                aria-pressed={mapViewMode === 'satellite'}
              >
                Satellite
              </button>
            </div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'center' }}>
                <SelectMarkerIcon size={20} />
              </span>
              Select a site card or map marker to view details.
            </p>
            <div className="map-page-header-count">
              <span>Showing {visibleSitesCount} of {totalSites} sites</span>
              <span className="info-tooltip-wrapper">
                <Info size={14} className="info-icon" />
                <span className="info-tooltip">Some sites aren't shown because location details aren't available.</span>
              </span>
            </div>
          </div>
          <MapView
            sites={filteredAndSortedSites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
            filters={filters}
            mapViewMode={mapViewMode}
            mapExpanded={window.innerWidth <= 768 ? mapState === 'expanded' : false}
          />
        </div>

        {/* Mobile-only: Site cards on top (row 1) */}
        <div className={`map-page-sidebar-mobile ${mapState === 'expanded' ? 'minimized' : ''} ${mapState === 'collapsed' ? 'collapsed' : ''}`}>
          {mapState !== 'expanded' && (
            <SiteList
              sites={filteredAndSortedSites}
              selectedSite={selectedSite}
              onSiteSelect={handleSiteSelect}
              mapViewMode={mapViewMode}
              setMapViewMode={setMapViewMode}
            />
          )}
        </div>

        {/* Mobile-only: Drag handle (row 2) */}
        <div 
          className={`map-drag-handle ${isDragging ? 'dragging' : ''}`}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
        >
          <div className="drag-handle-indicator"></div>
        </div>

        {/* Mobile-only: Map at bottom (row 3) - duplicate for mobile layout */}
        <div className={`map-page-map-mobile ${mapState === 'expanded' ? 'expanded' : mapState === 'collapsed' ? 'collapsed' : ''}`}>
          <MapView
            sites={filteredAndSortedSites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
            filters={filters}
            mapViewMode={mapViewMode}
            mapExpanded={mapState === 'expanded'}
          />
        </div>
      </div>

      {showModal && (
        <SiteDetailsModal
          site={selectedSite}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default MapPage
