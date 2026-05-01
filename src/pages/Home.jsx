import { useState, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AuctionInfoIcon from '../components/icons/AuctionInfoIcon'
import MapIcon from '../components/icons/MapIcon'
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'
import PhoneIcon from '../components/icons/PhoneIcon'
import { auctionSchedule } from '../config/auctionSchedule'
import './Home.css'

function Home() {
  const { t } = useTranslation()
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const footerRef = useRef(null)
  const formatRoundDate = (value) => value.replace(' 2026', '')

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

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-icon">
          <img src="/bda_logo.png" alt="BDA Logo" className="hero-logo" />
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
        <table className="key-dates-table">
          <tbody>
            <tr>
              <th scope="row">{t('home.timeline.commencement')}</th>
              <td>{auctionSchedule.commencement}</td>
            </tr>
            <tr>
              <th scope="row">{t('home.timeline.lastDayInterest')}</th>
              <td>{auctionSchedule.lastDayExpressInterest}</td>
            </tr>
            {auctionSchedule.rounds.map((round, i) => (
              <tr key={i}>
                <th scope="row">
                  {t('home.timeline.roundLabel', {
                    round: i + 1,
                    sites: round.sitesRange,
                  })}
                </th>
                <td>
                  {formatRoundDate(round.startDisplay)} – {formatRoundDate(round.endDisplay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
