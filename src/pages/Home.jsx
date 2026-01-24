import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AuctionInfoIcon from '../components/icons/AuctionInfoIcon'
import MapIcon from '../components/icons/MapIcon'
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'
import SitesIcon from '../components/icons/SitesIcon'
import './Home.css'

function Home() {
  const [timelineProgress, setTimelineProgress] = useState(0)
  const [eventStates, setEventStates] = useState(['future', 'future', 'future', 'future'])
  const footerRef = useRef(null)
  const timelineContainerRef = useRef(null)
  const timelineLineRef = useRef(null)

  // Parse date string to Date object
  const parseDate = (dateString) => {
    // Handle "27 January 2026" format (full month name)
    if (dateString.match(/^\d{1,2}\s+\w+\s+\d{4}$/)) {
      return new Date(dateString)
    }
    
    // Handle "13 Feb 2026, 17:00 PM" or "16 Feb 2026, 11:00 AM" format
    const cleaned = dateString.replace(/,/g, '').trim()
    const parts = cleaned.split(/\s+/)
    
    if (parts.length >= 4) {
      const day = parseInt(parts[0])
      const monthAbbr = parts[1]
      const year = parseInt(parts[2])
      
      // Map month abbreviations to month numbers
      const monthMap = {
        'Jan': 0, 'January': 0,
        'Feb': 1, 'February': 1,
        'Mar': 2, 'March': 2,
        'Apr': 3, 'April': 3,
        'May': 4,
        'Jun': 5, 'June': 5,
        'Jul': 6, 'July': 6,
        'Aug': 7, 'August': 7,
        'Sep': 8, 'September': 8,
        'Oct': 9, 'October': 9,
        'Nov': 10, 'November': 10,
        'Dec': 11, 'December': 11
      }
      
      const month = monthMap[monthAbbr]
      if (month === undefined) {
        console.warn(`Unknown month: ${monthAbbr}`)
        return new Date(dateString)
      }
      
      // Parse time if present
      if (parts.length >= 5) {
        const timeStr = parts[3]
        const ampm = parts[4] ? parts[4].toUpperCase() : null
        const timeParts = timeStr.split(':')
        let hours = parseInt(timeParts[0])
        const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
        
        // Handle AM/PM
        if (ampm === 'PM' && hours !== 12) {
          hours += 12
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0
        }
        
        return new Date(year, month, day, hours, minutes)
      } else {
        // No time, use start of day
        return new Date(year, month, day, 0, 0)
      }
    }
    
    // Fallback to default Date parsing
    return new Date(dateString)
  }

  // Calculate timeline progress and event states
  useEffect(() => {
    const now = new Date()
    
    // Define timeline events with their dates
    const event1Start = parseDate('27 January 2026')
    const event1End = new Date(event1Start)
    event1End.setHours(23, 59, 59, 999) // End of day for single-day event
    
    const event2Start = parseDate('13 Feb 2026, 17:00 PM')
    const event2End = event2Start // Single point in time
    
    const events = [
      {
        start: event1Start,
        end: event1End,
        isRange: false
      },
      {
        start: event2Start,
        end: event2End,
        isRange: false
      },
      {
        start: parseDate('16 Feb 2026, 11:00 AM'),
        end: parseDate('17 Feb 2026, 17:00 PM'),
        isRange: true
      },
      {
        start: parseDate('17 Feb 2026, 11:00 AM'),
        end: parseDate('18 Feb 2026, 17:00 PM'),
        isRange: true
      }
    ]

    // Calculate event states
    const states = events.map(event => {
      if (now < event.start) {
        return 'future'
      } else if (now >= event.start && now <= event.end) {
        return 'active'
      } else {
        return 'completed'
      }
    })
    
    setEventStates(states)

    // Calculate progress percentage
    // Progress is based on position along the timeline from first event start to last event end
    const timelineStart = events[0].start.getTime()
    const timelineEnd = events[events.length - 1].end.getTime()
    const timelineSpan = timelineEnd - timelineStart
    const nowTime = now.getTime()

    let progress = 0
    
    if (nowTime < timelineStart) {
      // Before timeline starts - show partial progress if within 3 days of commencement
      const daysUntilStart = (timelineStart - nowTime) / (1000 * 60 * 60 * 24) // Convert to days
      if (daysUntilStart <= 3) {
        // Show minimal progress proportional to how close we are
        // At 3 days: ~2%, at 0 days: ~5% (small visual indicator that doesn't cross first event)
        // The first event marker is at 0% of timeline, so we keep this very small
        const progressRatio = 1 - (daysUntilStart / 3) // 0 at 3 days, 1 at 0 days
        progress = 2 + (progressRatio * 3) // 2% at 3 days, 5% at 0 days
      } else {
        progress = 0
      }
    } else if (nowTime >= timelineEnd) {
      // After timeline ends
      progress = 100
    } else {
      // Within timeline - calculate percentage
      progress = ((nowTime - timelineStart) / timelineSpan) * 100
    }

    setTimelineProgress(Math.max(0, Math.min(100, progress)))
  }, [])

  // Calculate and set footer height for padding
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight
        // Set CSS custom property on root element
        document.documentElement.style.setProperty('--footer-height', `${height}px`)
      }
    }
    
    // Initial calculation
    updateFooterHeight()
    
    // Update on resize
    window.addEventListener('resize', updateFooterHeight)
    
    // Also update after a short delay to ensure footer is fully rendered
    const timeoutId = setTimeout(updateFooterHeight, 100)
    
    return () => {
      window.removeEventListener('resize', updateFooterHeight)
      clearTimeout(timeoutId)
    }
  }, [])

  // Calculate timeline line height on mobile to end at last event's text
  useEffect(() => {
    const updateTimelineLineHeight = () => {
      if (window.innerWidth <= 768 && timelineContainerRef.current && timelineLineRef.current) {
        const lastEvent = timelineContainerRef.current.querySelector('.timeline-event:last-child')
        if (lastEvent) {
          const lastCard = lastEvent.querySelector('.timeline-card')
          if (lastCard) {
            const containerTop = timelineContainerRef.current.getBoundingClientRect().top
            const lastCardBottom = lastCard.getBoundingClientRect().bottom
            const lineHeight = lastCardBottom - containerTop - 8 // Subtract 8px offset
            timelineLineRef.current.style.height = `${lineHeight}px`
          }
        }
      } else if (timelineLineRef.current) {
        // Reset to auto on desktop
        timelineLineRef.current.style.height = ''
      }
    }
    
    updateTimelineLineHeight()
    window.addEventListener('resize', updateTimelineLineHeight)
    
    // Also update after a delay to ensure content is rendered
    const timeoutId = setTimeout(updateTimelineLineHeight, 100)
    
    return () => {
      window.removeEventListener('resize', updateTimelineLineHeight)
      clearTimeout(timeoutId)
    }
  }, [])

  // Get marker class based on state
  const getMarkerClass = (state) => {
    if (state === 'completed') return 'timeline-marker timeline-marker-completed'
    if (state === 'active') return 'timeline-marker timeline-marker-active'
    return 'timeline-marker timeline-marker-hollow'
  }

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
        <div ref={timelineContainerRef} className="timeline-container">
          <div ref={timelineLineRef} className="timeline-line"></div>
          <div 
            className="timeline-progress"
            style={{
              '--progress-width': `${timelineProgress}%`,
              '--progress-height': `${timelineProgress}%`
            }}
          ></div>
          <div className="timeline-events">
            <div className="timeline-event">
              <div className={getMarkerClass(eventStates[0])}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">Commencement of e-Auction</h3>
                <div className="timeline-date">27 January 2026</div>
              </div>
            </div>
            
            <div className="timeline-event">
              <div className={getMarkerClass(eventStates[1])}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">Last Day to Express Interest</h3>
                <div className="timeline-date">13 Feb 2026, 17:00 PM</div>
              </div>
            </div>
            
            <div className="timeline-event">
              <div className={getMarkerClass(eventStates[2])}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">Round 1 (Sites 1 - 42)</h3>
                <div className="timeline-date-multi">
                  <div className="timeline-date-start">16 Feb 2026, 11:00 AM</div>
                  <div className="timeline-date-separator">to</div>
                  <div className="timeline-date-end">17 Feb 2026, 17:00 PM</div>
                </div>
              </div>
            </div>
            
            <div className="timeline-event">
              <div className={getMarkerClass(eventStates[3])}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">Round 2 (Sites 43 - 83)</h3>
                <div className="timeline-date-multi">
                  <div className="timeline-date-start">17 Feb 2026, 11:00 AM</div>
                  <div className="timeline-date-separator">to</div>
                  <div className="timeline-date-end">18 Feb 2026, 17:00 PM</div>
                </div>
              </div>
            </div>
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

      <div ref={footerRef} className="home-footer">
        <p className="footer-disclaimer">Information is sourced from BDA and reviewed with due diligence. While we strive for accuracy, this data can sometimes be incomplete, outdated or not accurate.</p>
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
