import { useState, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AuctionInfoIcon from '../components/icons/AuctionInfoIcon'
import MapIcon from '../components/icons/MapIcon'
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'
import SitesIcon from '../components/icons/SitesIcon'
import PhoneIcon from '../components/icons/PhoneIcon'
import { auctionSchedule } from '../config/auctionSchedule'
import './Home.css'

const MARKER_CLASS = 'timeline-marker timeline-marker-active'

function Home() {
  const { t } = useTranslation()
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const footerRef = useRef(null)
  const timelineContainerRef = useRef(null)
  const timelineLineRef = useRef(null)

  // Calculate and set footer height for padding
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight
        document.documentElement.style.setProperty('--footer-height', `${height}px`)
      }
    }

    updateFooterHeight()
    window.addEventListener('resize', updateFooterHeight)
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
            const lineHeight = lastCardBottom - containerTop - 8
            timelineLineRef.current.style.height = `${lineHeight}px`
          }
        }
      } else if (timelineLineRef.current) {
        timelineLineRef.current.style.height = ''
      }
    }

    updateTimelineLineHeight()
    window.addEventListener('resize', updateTimelineLineHeight)
    const timeoutId = setTimeout(updateTimelineLineHeight, 100)

    return () => {
      window.removeEventListener('resize', updateTimelineLineHeight)
      clearTimeout(timeoutId)
    }
  }, [])

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
          <div className="timeline-events">
            <div className="timeline-event">
              <div className={MARKER_CLASS}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">{t('home.timeline.commencement')}</h3>
                <div className="timeline-date">{auctionSchedule.commencement}</div>
              </div>
            </div>

            <div className="timeline-event">
              <div className={MARKER_CLASS}></div>
              <div className="timeline-card">
                <h3 className="timeline-title">{t('home.timeline.lastDayInterest')}</h3>
                <div className="timeline-date">{auctionSchedule.lastDayExpressInterest}</div>
              </div>
            </div>

            {auctionSchedule.rounds.map((round, i) => (
              <div key={i} className="timeline-event">
                <div className={MARKER_CLASS}></div>
                <div className="timeline-card">
                  <h3 className="timeline-title">
                    {t('home.timeline.roundLabel', {
                      round: i + 1,
                      sites: round.sitesRange,
                    })}
                  </h3>
                  <div className="timeline-date-multi">
                    <div className="timeline-date-start">{round.startDisplay}</div>
                    <div className="timeline-date-separator">to</div>
                    <div className="timeline-date-end">{round.endDisplay}</div>
                  </div>
                </div>
              </div>
            ))}
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
            <span>
              {t('home.footer.builtBy')}{' '}
              <a href="https://zencitizen.in/" target="_blank" rel="noopener noreferrer">
                Zen Citizen
              </a>
            </span>
            <span className="footer-separator">|</span>
            <a href="https://zencitizen.in/contact-us/" target="_blank" rel="noopener noreferrer">
              {t('home.footer.shareFeedback')}
            </a>
          </div>
          <span className="footer-separator footer-line-separator">|</span>
          <div className="footer-line-2">
            <a href="https://www.bdakarnataka.gov.in/" target="_blank" rel="noopener noreferrer">
              {t('home.footer.bdaWebsite')}
            </a>
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
                1: (
                  <a
                    href="http://bdakarnataka.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1A73E8', textDecoration: 'underline', textUnderlineOffset: '0.25em' }}
                  />
                ),
              }}
            />
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home
