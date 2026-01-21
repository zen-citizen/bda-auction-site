import { getSessionDate } from '../lib/utils'
import AreaIcon from './icons/AreaIcon'
import SitesIcon from './icons/SitesIcon'
import './SiteList.css'

function SiteList({ sites, selectedSite, onSiteSelect }) {
  return (
    <div className="site-list">
      <div className="site-list-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'center' }}>
            <SitesIcon size={32} />
          </span>
          Sites ({sites.length})
        </h3>
      </div>
      <div className="site-list-content">
        {sites.length === 0 ? (
          <div className="no-sites">No sites found matching your filters.</div>
        ) : (
          sites.map(site => (
            <div
              key={site.slNo}
              className={`site-item ${selectedSite?.slNo === site.slNo ? 'selected' : ''}`}
              onClick={() => onSiteSelect(site)}
              data-site-id={site.slNo}
            >
              <div className="site-item-header">
                <span className="site-number">Sl.No #{site.slNo}</span>
                <span className="site-session">{getSessionDate(site.biddingSession)}</span>
              </div>
              <div className="site-item-layout">{site.layout}</div>
              <div className="site-item-details">
                <span>Site No: {site.siteNo}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ color: '#4B2840' }}>
                    <AreaIcon size={20} />
                  </span>
                  Total Area: {site.totalArea} sq.m
                </span>
              </div>
              {!site.hasCoordinates && (
                <div className="site-item-warning">No coordinates available</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SiteList
