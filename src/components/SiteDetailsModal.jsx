import { getSessionDate } from '../lib/utils'
import { ExternalLink } from 'lucide-react'
import AreaIcon from './icons/AreaIcon'
import PhoneIcon from './icons/PhoneIcon'
import EWIcon from './icons/EWIcon'
import NSIcon from './icons/NSIcon'
import './SiteDetailsModal.css'

// Helper function to format phone number
function formatPhoneNumber(value) {
  if (!value || value === '' || value === 'NA') return null
  const cleaned = value.toString().trim()
  return cleaned
}

// Version: 2025-01-27 - All CSV fields always visible
function SiteDetailsModal({ site, onClose }) {
  if (!site) return null

  const contactNumber = formatPhoneNumber(site.contactNumber)
  const googleMapsLink = site.googleMapsLink && site.googleMapsLink !== 'NA' && site.googleMapsLink.trim() !== '' 
    ? site.googleMapsLink 
    : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header-sticky">
          <h2>Site Details</h2>
          <div className="modal-site-number">Sl.No #{site.slNo}</div>
        </div>
        
        <div className="site-details">
          {/* Session & Contact Section */}
          <div className="detail-section">
            <h3 className="section-title">Session & Contact</h3>
            <div className="detail-row">
              <span className="detail-label">Bidding Round:</span>
              <span className="detail-value">{getSessionDate(site.biddingSession)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {contactNumber && <PhoneIcon size={20} />}
                Site Information Coordinator
              </span>
              <span className="detail-value">
                {contactNumber ? (
                  <a href={`tel:+91${contactNumber}`} className="link-phone">
                    +91 {contactNumber}
                  </a>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="detail-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="detail-row">
              <span className="detail-label">Site No:</span>
              <span className="detail-value">{site.siteNo || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Layout Details:</span>
              <span className="detail-value">{site.layoutDetails || site.layout || 'N/A'}</span>
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="detail-section">
            <h3 className="section-title">Dimensions</h3>
            <div className="detail-row">
              <span className="detail-label">Site Shape:</span>
              <span className="detail-value">{site.siteSize || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{site.type || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#4B2840' }}>
                  <EWIcon size={22} />
                </span>
                E to W:
              </span>
              <span className="detail-value">{site.eToW ? `${site.eToW} m` : 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#4B2840' }}>
                  <NSIcon size={22} />
                </span>
                N to S:
              </span>
              <span className="detail-value">{site.nToS ? `${site.nToS} m` : 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#4B2840' }}>
                  <AreaIcon size={22} />
                </span>
                Total Area:
              </span>
              <span className="detail-value">{site.totalArea ? `${site.totalArea} sq.m` : 'N/A'}</span>
            </div>
          </div>

          {/* Location & Pricing Section */}
          <div className="detail-section">
            <h3 className="section-title">Location & Pricing</h3>
            <div className="detail-row">
              <span className="detail-label">
                {googleMapsLink ? (
                  <a 
                    href={googleMapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-external"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ExternalLink size={16} />
                    View on Google Maps
                  </a>
                ) : (
                  <span style={{ color: '#666', fontStyle: 'italic' }}>Google Maps link unavailable</span>
                )}
              </span>
              <span className="detail-value"></span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Survey No:</span>
              <span className="detail-value">{site.surveyNo || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rate Per Sq.M:</span>
              <span className="detail-value">
                {site.ratePerSqMtr && site.ratePerSqMtr !== 'NA' && site.ratePerSqMtr.trim() !== '' 
                  ? `₹${parseFloat(site.ratePerSqMtr).toLocaleString('en-IN')}`
                  : 'N/A'}
              </span>
            </div>
          </div>

        </div>

        <div className="modal-footer-sticky">
          <a 
            href="https://kppp.karnataka.gov.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Go to Auction Portal
          </a>
        </div>
      </div>
    </div>
  )
}

export default SiteDetailsModal
