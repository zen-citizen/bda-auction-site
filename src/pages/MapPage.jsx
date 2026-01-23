import { useState, useMemo, useEffect } from 'react'
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

    // Apply site size filter (area ranges)
    if (filters.siteSize) {
      filtered = filtered.filter(site => {
        const area = parseFloat(site.totalArea) || 0
        if (filters.siteSize === "0-600" && (area < 0 || area >= 600)) return false
        if (filters.siteSize === "600-1200" && (area < 600 || area >= 1200)) return false
        if (filters.siteSize === "1200-2400" && (area < 1200 || area >= 2400)) return false
        if (filters.siteSize === ">2400" && area < 2400) return false
        return true
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

      <div className="map-page-content">
        <div className="map-page-sidebar">
          <SiteList
            sites={filteredAndSortedSites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
            mapViewMode={mapViewMode}
            setMapViewMode={setMapViewMode}
          />
        </div>

        <div className="map-page-map">
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
