import { Link } from 'react-router-dom'
import AuctionInfoIcon from '../components/icons/AuctionInfoIcon'
import MapIcon from '../components/icons/MapIcon'
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'
import SitesIcon from '../components/icons/SitesIcon'
import './Home.css'

function Home() {

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-icon">
          <SitesIcon size={70} />
        </div>
        <h1>BDA eAuction of Residential Sites</h1>
        <p className="hero-publication">Publication Number: T-16/2025-26</p>
        <p className="hero-subtitle">
          Conducted under BDA Disposal of Corner, Intermediate & Other eAuctionable{' '}
          <a 
            href="https://www.bdakarnataka.in/api/media/about-us/pdf_press_release/Conducted_under_BDA_Disposal_of_Corner__Intermediate___Other_Auctionable_Sites_Rules__1984_1769170438464_fbcab00b.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1A73E8', textDecoration: 'underline', textUnderlineOffset: '0.25em' }}
          >
            Sites Rules
          </a>
          , 1984
        </p>
      </div>

      <div className="key-dates">
        <h2>Important Dates</h2>
        <div className="dates-grid">
          <div className="date-item">
            <div className="date-label">Commencement of e-Auction</div>
            <div className="date-value">27 February 2026</div>
          </div>
          <div className="date-divider"></div>
          <div className="date-item">
            <div className="date-label">Last Date to Express Interest</div>
            <div className="date-value">13 February 2026</div>
            <div className="date-time">Up to 5:00&nbsp;PM&nbsp;IST</div>
          </div>
          <div className="date-divider"></div>
          <div className="date-item">
            <div className="date-label">Round 1 (Sites 1 - 42)</div>
            <div className="date-value">16 - 17 Feb 2026</div>
            <div className="date-time">Starts: 16 Feb 2026 at 11:00&nbsp;AM<br />Closes: 17 Feb 2026 at 5:00&nbsp;PM</div>
          </div>
          <div className="date-divider"></div>
          <div className="date-item">
            <div className="date-label">Round 2 (Sites 43 - 83)</div>
            <div className="date-value">17 - 18 Feb 2026</div>
            <div className="date-time">Starts: 17 Feb 2026 at 11:00&nbsp;AM<br />Closes: 18 Feb 2026 at 5:00&nbsp;PM</div>
          </div>
        </div>
      </div>

      <div className="action-cards">
        <Link to="/map" className="action-card">
          <div className="action-icon">
            <MapIcon size={32} />
          </div>
          <h3>View Sites on Map</h3>
          <p>Explore all eAuction sites with interactive map, filters, and detailed information</p>
        </Link>
        <Link to="/info" className="action-card">
          <div className="action-icon">
            <AuctionInfoIcon size={32} />
          </div>
          <h3>eAuction Information</h3>
          <p>Learn about eligibility, documents required, financials, and Terms & Conditions</p>
        </Link>
        <a 
          href="https://kppp.karnataka.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="action-card"
        >
          <div className="action-icon">
            <ExternalLinkIcon size={32} />
          </div>
          <h3>Go to eAuction Portal</h3>
          <p>Access the official eAuction portal to register and place bids</p>
        </a>
      </div>

      <div className="home-footer">
        <p className="footer-disclaimer">Information is sourced from BDA and reviewed with due diligence. While we strive for accuracy, these sources can sometimes be incomplete, outdated or not accurate.</p>
        <div className="built-by">
          <span>Built by <a href="https://zencitizen.in/" target="_blank" rel="noopener noreferrer">Zen Citizen</a></span>
          <span className="footer-separator">|</span>
          <a href="https://zencitizen.in/contact-us/" target="_blank" rel="noopener noreferrer">Share feedback</a>
        </div>
      </div>
    </div>
  )
}

export default Home
