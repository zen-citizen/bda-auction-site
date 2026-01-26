import { useState, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AuctionInfoIcon from '../components/icons/AuctionInfoIcon'
import MapIcon from '../components/icons/MapIcon'
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'
import SitesIcon from '../components/icons/SitesIcon'
import PhoneIcon from '../components/icons/PhoneIcon'
import './Home.css'

function Home() {
  const { t } = useTranslation()
  const [timelineProgress, setTimelineProgress] = useState(0)
  const [eventStates, setEventStates] = useState(['future', 'future', 'future', 'future'])
  const [firstMarkerOffsetMobile, setFirstMarkerOffsetMobile] = useState(2.5) // Default fallback value
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const footerRef = useRef(null)
  const timelineContainerRef = useRef(null)
  const timelineLineRef = useRef(null)

  // Get current date/time in IST (Indian Standard Time, UTC+5:30)
  const getISTDate = () => {
    const now = new Date()
    // Get IST time components
    const istString = now.toLocaleString("en-US", { 
      timeZone: "Asia/Kolkata",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    // Parse format: "MM/DD/YYYY, HH:MM:SS"
    const parts = istString.match(/(\d+)\/(\d+)\/(\d+),?\s+(\d+):(\d+):(\d+)/)
    if (parts) {
      const month = parseInt(parts[1]) - 1 // JavaScript months are 0-indexed
      const day = parseInt(parts[2])
      const year = parseInt(parts[3])
      const hours = parseInt(parts[4])
      const minutes = parseInt(parts[5])
      const seconds = parseInt(parts[6] || 0)
      
      // Create date in local timezone that represents the IST time
      // This allows proper comparison with parsed IST dates
      return new Date(year, month, day, hours, minutes, seconds)
    }
    
    // Fallback: use Intl.DateTimeFormat for more reliable parsing
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    const parts2 = formatter.formatToParts(now)
    const dateParts = {}
    parts2.forEach(part => {
      dateParts[part.type] = part.value
    })
    
    return new Date(
      parseInt(dateParts.year),
      parseInt(dateParts.month) - 1,
      parseInt(dateParts.day),
      parseInt(dateParts.hour),
      parseInt(dateParts.minute),
      parseInt(dateParts.second || 0)
    )
  }

  // Parse date string to Date object in IST
  // Creates a Date object in local timezone representing the given date/time in IST
  // This matches the format used by getISTDate() for consistent comparison
  const parseDate = (dateString) => {
    // Handle "27 January 2026" format (full month name)
    if (dateString.match(/^\d{1,2}\s+\w+\s+\d{4}$/)) {
      const parts = dateString.split(/\s+/)
      const day = parseInt(parts[0])
      const monthName = parts[1]
      const year = parseInt(parts[2])
      
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
      
      const month = monthMap[monthName]
      if (month === undefined) {
        return new Date(dateString)
      }
      
      // Create date in local timezone (same format as getISTDate())
      // This represents IST time in local timezone for consistent comparison
      return new Date(year, month, day, 0, 0, 0)
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
      let hours = 0
      let minutes = 0
      if (parts.length >= 5) {
        const timeStr = parts[3]
        const ampm = parts[4] ? parts[4].toUpperCase() : null
        const timeParts = timeStr.split(':')
        hours = parseInt(timeParts[0])
        minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
        
        // Handle AM/PM
        if (ampm === 'PM' && hours !== 12) {
          hours += 12
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0
        }
      }
      
      // Create date in local timezone (same format as getISTDate())
      // This represents IST time in local timezone for consistent comparison
      return new Date(year, month, day, hours, minutes, 0)
    }
    
    // Fallback to default Date parsing
    return new Date(dateString)
  }

  // Calculate timeline progress and event states
  useEffect(() => {
    const calculateProgress = () => {
      const now = getISTDate()
      
      // Define timeline events with their dates (all in IST)
      const event1Start = parseDate('27 January 2026')
      // End of day in IST (23:59:59 IST on 27 January 2026)
      // Create as 28 Jan 00:00:00 IST and subtract 1ms
      const event1End = parseDate('28 January 2026')
      event1End.setTime(event1End.getTime() - 1) // 1ms before midnight = 23:59:59.999
      
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

      // Detect if we're on desktop (width > 768px) - checked at calculation time
      const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768

      let progress = 0
      
      if (nowTime < timelineStart) {
        // Before timeline starts - show minimal progress when very close
        const daysUntilStart = (timelineStart - nowTime) / (1000 * 60 * 60 * 24)
        if (daysUntilStart <= 1) {
          // Less than 1 day away - show small progress that approaches first marker
          const progressRatio = 1 - daysUntilStart // 0 at 1 day, 1 at 0 days
          
          // DESKTOP: Horizontal timeline, progress uses width
          // First marker is centered in first event container (~12.5% of timeline width)
          // Progress should approach but not exceed this position
          if (isDesktop) {
            progress = 8 + (progressRatio * 4.5) // 8% at 1 day, 12.5% at 0 days
          } 
          // MOBILE: Vertical timeline, progress uses height  
          // First marker is at top (0% of timeline height)
          // Progress fills from top, should be minimal to not cross marker
          else {
            progress = 1 + (progressRatio * 2) // 1% at 1 day, 3% at 0 days
          }
        } else {
          progress = 0
        }
      } else if (nowTime >= timelineEnd) {
        // After timeline ends - progress is 100%
        progress = 100
      } else {
        // Within timeline - calculate percentage based on position
        // Same calculation for both desktop and mobile (time-based percentage)
        progress = ((nowTime - timelineStart) / timelineSpan) * 100
        
        // When first event is active, ensure progress starts from first marker position
        // This prevents a highlighted segment from appearing before the first marker
        if (states[0] === 'active') {
          // First marker position offsets:
          // Desktop: ~12.5% (first marker centered in first event container, which is 1/4 of timeline width)
          // Mobile: dynamically calculated based on actual marker position relative to timeline height
          const firstMarkerOffset = isDesktop ? 12.5 : firstMarkerOffsetMobile
          
          // If calculated progress is less than marker position, set it to marker position
          // Otherwise, keep the calculated progress
          if (progress < firstMarkerOffset) {
            progress = firstMarkerOffset
          }
        }
      }

      setTimelineProgress(Math.max(0, Math.min(100, progress)))
    }
    
    // Calculate immediately
    calculateProgress()
    
    // Update every minute
    const interval = setInterval(calculateProgress, 60000)
    
    return () => clearInterval(interval)
  }, [firstMarkerOffsetMobile])

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

  // Calculate first marker position on mobile as percentage of timeline height
  useEffect(() => {
    const calculateFirstMarkerOffset = () => {
      if (window.innerWidth <= 768 && timelineContainerRef.current && timelineLineRef.current) {
        const firstEvent = timelineContainerRef.current.querySelector('.timeline-event:first-child')
        if (firstEvent) {
          const marker = firstEvent.querySelector('.timeline-marker')
          if (marker && timelineLineRef.current) {
            const containerTop = timelineContainerRef.current.getBoundingClientRect().top
            const markerRect = marker.getBoundingClientRect()
            const markerCenter = markerRect.top + markerRect.height / 2 - containerTop
            
            // Get the timeline line height (either from style or calculated height)
            const lineHeight = timelineLineRef.current.offsetHeight || 
                              timelineLineRef.current.getBoundingClientRect().height
            
            if (lineHeight > 0) {
              const offsetPercentage = (markerCenter / lineHeight) * 100
              setFirstMarkerOffsetMobile(offsetPercentage)
            }
          }
        }
      }
    }
    
    calculateFirstMarkerOffset()
    window.addEventListener('resize', calculateFirstMarkerOffset)
    
    // Also update after a delay to ensure content is rendered
    const timeoutId = setTimeout(calculateFirstMarkerOffset, 150)
    
    return () => {
      window.removeEventListener('resize', calculateFirstMarkerOffset)
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
        <h1>{t('home.title')}</h1>
        <p className="hero-publication">{t('home.publicationNumber')}</p>
        <p className="hero-subtitle">
          {t('home.subtitle')}{' '}
          <a 
            href="https://www.bdakarnataka.in/api/media/about-us/pdf_press_release/Conducted_under_BDA_Disposal_of_Corner__Intermediate___Other_Auctionable_Sites_Rules__1984_1769170438464_fbcab00b.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1A73E8', textDecoration: 'underline', textUnderlineOffset: '0.25em' }}
          >
            {t('home.sitesRules')}
          </a>
          {t('home.subtitleYear')}
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
                <h3 className="timeline-title">{t('home.timeline.commencement')}</h3>
                <div className="timeline-date">27 January 2026</div>
              </div>
            </div>
            
            <div className="timeline-event">
              <div className={getMarkerClass(eventStates[1])}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">{t('home.timeline.lastDayInterest')}</h3>
                <div className="timeline-date">13 Feb 2026, 17:00 PM</div>
              </div>
            </div>
            
            <div className="timeline-event">
              <div className={getMarkerClass(eventStates[2])}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">{t('home.timeline.round1')}</h3>
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
                <h3 className="timeline-title">{t('home.timeline.round2')}</h3>
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
          <h3>{t('home.actionCards.viewSites.title')}</h3>
          <p>{t('home.actionCards.viewSites.description')}</p>
        </Link>
        <Link to="/info" className="action-card">
          <div className="action-icon">
            <AuctionInfoIcon size={32} />
          </div>
          <h3>{t('home.actionCards.eAuctionInfo.title')}</h3>
          <p>{t('home.actionCards.eAuctionInfo.description')}</p>
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
          <h3>{t('home.actionCards.goToPortal.title')}</h3>
          <p>{t('home.actionCards.goToPortal.description')}</p>
        </a>
      </div>

      <div ref={footerRef} className="home-footer">
        <div className="built-by">
          <div className="footer-line-1">
            <button 
              onClick={() => setShowDisclaimerModal(true)}
              className="footer-disclaimer-link"
            >
              {t('home.footer.disclaimerLabel')}
            </button>
            <span className="footer-separator">|</span>
            <span>{t('home.footer.builtBy')} <a href="https://zencitizen.in/" target="_blank" rel="noopener noreferrer">Zen Citizen</a></span>
            <span className="footer-separator">|</span>
            <a href="https://zencitizen.in/contact-us/" target="_blank" rel="noopener noreferrer">{t('home.footer.shareFeedback')}</a>
          </div>
          <span className="footer-separator footer-line-separator">|</span>
          <div className="footer-line-2">
            <a href="https://www.bdakarnataka.gov.in/" target="_blank" rel="noopener noreferrer">{t('home.footer.bdaWebsite')}</a>
            <span className="footer-separator">|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <PhoneIcon size={14} style={{ flexShrink: 0 }} />
              <span>{t('home.footer.cac')}: </span>
              <a href="tel:+919483166622">+91 94831 66622</a>
            </span>
          </div>
        </div>
      </div>

      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent onClose={() => setShowDisclaimerModal(false)}>
          <DialogHeader>
            <DialogTitle>{t('home.footer.disclaimerLabel')}</DialogTitle>
          </DialogHeader>
          <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <Trans
              i18nKey="home.footer.disclaimer"
              components={{
                1: <a href="http://bdakarnataka.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#1A73E8', textDecoration: 'underline', textUnderlineOffset: '0.25em' }} />
              }}
            />
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home
