import { useState, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PhoneIcon from '../components/icons/PhoneIcon'
import DocumentsIcon from '../components/icons/DocumentsIcon'
import WhereToBidIcon from '../components/icons/WhereToBidIcon'
import CalendarIcon from '../components/icons/CalendarIcon'
import MoneyIcon from '../components/icons/MoneyIcon'
import ImportantIcon from '../components/icons/ImportantIcon'
import HelpSupportIcon from '../components/icons/HelpSupportIcon'
import './InfoPage.css'

function InfoPage() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('what-is-being-eauctioned')
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const isScrollingProgrammatically = useRef(false)
  const scrollTimeoutRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const sections = [
      'what-is-being-eauctioned',
      'who-can-participate',
      'documents-required',
      'where-to-bid',
      'important-dates',
      'financials',
      'important-cautions',
      'help-support'
    ]

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
      // Skip updates during programmatic scrolling
      if (isScrollingProgrammatically.current) {
        return
      }
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Detect mobile screen size and set default collapsed state
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setMenuExpanded(false)
      } else {
        setMenuExpanded(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  const handleMenuClick = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Immediately set the active section to the target (bypassing observer)
      setActiveSection(sectionId)
      
      // Disable observer updates during programmatic scrolling
      isScrollingProgrammatically.current = true

      const headerOffset = 160
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Re-enable observer after scroll completes
      // Smooth scroll typically takes ~500-1000ms
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingProgrammatically.current = false
        scrollTimeoutRef.current = null
      }, 1000)

      // Close menu on mobile after clicking
      if (window.innerWidth <= 768) {
        setMenuExpanded(false)
      }
    }
  }

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

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header-sticky">
          <h1>{t('infoPage.title')}</h1>
        </div>
        <div className="info-page-layout">
          <aside className="info-sidebar">
            <button
              className="info-menu-toggle-mobile"
              onClick={toggleMenu}
              aria-expanded={menuExpanded}
              aria-label={t('common.buttons.toggleContents')}
            >
              <span className="info-menu-toggle-label">{t('common.labels.contents')}</span>
              {menuExpanded ? (
                <ChevronUp className="info-menu-toggle-icon" size={20} />
              ) : (
                <ChevronDown className="info-menu-toggle-icon" size={20} />
              )}
            </button>
            <nav className={`info-menu ${menuExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="info-menu-title">{t('infoPage.menu.contents')}</div>
              <a 
                href="#what-is-being-eauctioned" 
                onClick={(e) => handleMenuClick(e, 'what-is-being-eauctioned')}
                className={activeSection === 'what-is-being-eauctioned' ? 'active' : ''}
              >
                {t('infoPage.menu.whatIsBeingAuctioned')}
              </a>
              <a 
                href="#who-can-participate"
                onClick={(e) => handleMenuClick(e, 'who-can-participate')}
                className={activeSection === 'who-can-participate' ? 'active' : ''}
              >
                {t('infoPage.menu.whoCanParticipate')}
              </a>
              <a 
                href="#documents-required"
                onClick={(e) => handleMenuClick(e, 'documents-required')}
                className={activeSection === 'documents-required' ? 'active' : ''}
              >
                {t('infoPage.menu.documentsRequired')}
              </a>
              <a 
                href="#where-to-bid"
                onClick={(e) => handleMenuClick(e, 'where-to-bid')}
                className={activeSection === 'where-to-bid' ? 'active' : ''}
              >
                {t('infoPage.menu.whereToBid')}
              </a>
              <a 
                href="#important-dates"
                onClick={(e) => handleMenuClick(e, 'important-dates')}
                className={activeSection === 'important-dates' ? 'active' : ''}
              >
                {t('infoPage.menu.importantDates')}
              </a>
              <a 
                href="#financials"
                onClick={(e) => handleMenuClick(e, 'financials')}
                className={activeSection === 'financials' ? 'active' : ''}
              >
                {t('infoPage.menu.financials')}
              </a>
              <a 
                href="#important-cautions"
                onClick={(e) => handleMenuClick(e, 'important-cautions')}
                className={activeSection === 'important-cautions' ? 'active' : ''}
              >
                {t('infoPage.menu.importantCautions')}
              </a>
              <a 
                href="#help-support"
                onClick={(e) => handleMenuClick(e, 'help-support')}
                className={activeSection === 'help-support' ? 'active' : ''}
              >
                {t('infoPage.menu.helpSupport')}
              </a>
            </nav>
          </aside>
          <div className="info-content">

        <section id="what-is-being-eauctioned" className="info-section">
          <h2>{t('infoPage.sections.whatIsBeingAuctioned.title')}</h2>
          <p>
          {t('infoPage.sections.whatIsBeingAuctioned.description')}
          </p>
          <p>
            <strong>{t('infoPage.sections.whatIsBeingAuctioned.note')}</strong> {t('infoPage.sections.whatIsBeingAuctioned.noteText')}
          </p>
        </section>

        <section id="who-can-participate" className="info-section">
          <h2>{t('infoPage.sections.whoCanParticipate.title')}</h2>
          <ul>
            {t('infoPage.sections.whoCanParticipate.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="documents-required" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <DocumentsIcon size={28} />
            </span>
            {t('infoPage.sections.documentsRequired.title')}
          </h2>
          <ul>
            {t('infoPage.sections.documentsRequired.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>
                {item}
                {index === 2 && (
                  <ul>
                    <li>{t('infoPage.sections.documentsRequired.addressProof.aadhaar')}</li>
                    <li>{t('infoPage.sections.documentsRequired.addressProof.voterId')}</li>
                    <li>{t('infoPage.sections.documentsRequired.addressProof.passport')}</li>
                    <li>{t('infoPage.sections.documentsRequired.addressProof.drivingLicence')}</li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="where-to-bid" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <WhereToBidIcon size={28} />
            </span>
            {t('infoPage.sections.whereToBid.title')}
          </h2>
          <p>
            <strong>{t('infoPage.sections.whereToBid.portalLabel')}</strong>
            <a href="https://kppp.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.75rem', fontWeight: '600' }}>
              <ExternalLink size={14} />
              https://kppp.karnataka.gov.in/
            </a>
          </p>
        </section>

        <section id="important-dates" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <CalendarIcon size={28} />
            </span>
            {t('infoPage.sections.importantDates.title')}
          </h2>
          <div className="dates-timeline">
            <div className="timeline-item">
              <div className="timeline-date">27 January 2026</div>
              <div className="timeline-content">
                <h3>{t('infoPage.sections.importantDates.commencement')}</h3>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">13 February 2026</div>
              <div className="timeline-content">
                <h3>{t('infoPage.sections.importantDates.lastDateInterest')}</h3>
                <p>{t('infoPage.sections.importantDates.lastDateTime')}</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">16 - 17 February 2026</div>
              <div className="timeline-content">
                <h3>{t('infoPage.sections.importantDates.round1')}</h3>
                <p>
                  <strong>{t('infoPage.sections.importantDates.starts')}</strong> 16 Feb 2026 at 11:00&nbsp;AM&nbsp;IST<br />
                  <strong>{t('infoPage.sections.importantDates.closes')}</strong> 17 Feb 2026 at 17:00&nbsp;PM&nbsp;IST<br />
                  <strong>{t('infoPage.sections.importantDates.deltaTime')}</strong> {t('infoPage.sections.importantDates.minutes')}
                </p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">17 - 18 February 2026</div>
              <div className="timeline-content">
                <h3>{t('infoPage.sections.importantDates.round2')}</h3>
                <p>
                  <strong>{t('infoPage.sections.importantDates.starts')}</strong> 17 Feb 2026 at 11:00&nbsp;AM&nbsp;IST<br />
                  <strong>{t('infoPage.sections.importantDates.closes')}</strong> 18 Feb 2026 at 17:00&nbsp;PM&nbsp;IST<br />
                  <strong>{t('infoPage.sections.importantDates.deltaTime')}</strong> {t('infoPage.sections.importantDates.minutes')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="financials" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <MoneyIcon size={28} />
            </span>
            {t('infoPage.sections.financials.title')}
          </h2>
          
          <div className="financial-item">
            <div className="financial-subsection">
              <h3>{t('infoPage.sections.financials.emd.title')}</h3>
              <p className="financial-text-block"><strong>{t('infoPage.sections.financials.emd.amount')}</strong> {t('infoPage.sections.financials.emd.amountValue')}</p>
              <div className="warning-text">
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'flex-start', paddingTop: '0.2em', flexShrink: 0 }}>
                    <ImportantIcon size={18} />
                  </span>
                  <span>
                    {t('infoPage.sections.financials.emd.warning')}{' '}
                    <a href="https://kppp.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                      <ExternalLink size={14} />
                      https://kppp.karnataka.gov.in/
                    </a>
                    <br />
                    <br />
                    {t('infoPage.sections.financials.emd.warning2')}
                  </span>
                </span>
              </div>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3>{t('infoPage.sections.financials.biddingRequirements.title')}</h3>
              <ul>
                {t('infoPage.sections.financials.biddingRequirements.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3>{t('infoPage.sections.financials.paymentAfterWinning.title')}</h3>
              <ul>
                {t('infoPage.sections.financials.paymentAfterWinning.items', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginTop: '0', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#333' }}>
                  {t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.title')}
                </h4>
                <div className="payment-details-subsection">
                <p><strong>{t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.accountName')}</strong> {t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.accountNameValue')}</p>
                  <p><strong>{t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.bank')}</strong> {t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.bankValue')}</p>
                  <p><strong>{t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.accountNumber')}</strong> {t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.accountNumberValue')}</p>
                  <p><strong>{t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.ifscCode')}</strong> {t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.ifscCodeValue')}</p>
                  <p><strong>{t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.modeOfPayment')}</strong> {t('infoPage.sections.financials.paymentAfterWinning.paymentDetails.modeOfPaymentValue')}</p>
                </div>
              </div>
              <div className="warning-text" style={{ marginTop: '1rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'flex-start', paddingTop: '0.2em', flexShrink: 0 }}>
                    <ImportantIcon size={18} />
                  </span>
                  <span>{t('infoPage.sections.financials.paymentAfterWinning.warning')}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="important-cautions" className="info-section">
          <h2>{t('infoPage.sections.importantCautions.title')}</h2>
          <ul className="caution-list">
            {t('infoPage.sections.importantCautions.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="help-support" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <HelpSupportIcon size={28} />
            </span>
            {t('infoPage.sections.helpSupport.title')}
          </h2>
          
          <div className="help-item">
            <h3>{t('infoPage.sections.helpSupport.demo.title')}</h3>
            <p>
              {t('infoPage.sections.helpSupport.demo.description')}
            </p>
            <p>
              <strong>{t('infoPage.sections.helpSupport.demo.address')}</strong>{' '}
              <a 
                href="https://share.google/e7f1zRv3ikFL0rEYU" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-external"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <ExternalLink size={14} />
                </span>
                T. Chowdaiah Road, Kumara Park West, Bengaluru 560020
              </a>
            </p>
            <p className="note-text">
              <strong>{t('infoPage.sections.helpSupport.demo.note')}</strong> {t('infoPage.sections.helpSupport.demo.noteText')}
            </p>
          </div>

          <div className="help-item">
            <h3>{t('infoPage.sections.helpSupport.videoTutorials.title')}</h3>
            <p>
              <a href="https://kppp.karnataka.gov.in/#/portal/download-user-manuals-tenders" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ExternalLink size={14} />
                {t('infoPage.sections.helpSupport.videoTutorials.downloadLink')}
              </a>
            </p>
            <p className="note-text">
              {t('infoPage.sections.helpSupport.videoTutorials.referTo')}
            </p>
            <ul>
              {t('infoPage.sections.helpSupport.videoTutorials.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="help-item">
            <h3>{t('infoPage.sections.helpSupport.contactInfo.title')}</h3>
            <div className="contact-details">
              <p className="contact-group-bda-website">
                <strong>{t('infoPage.sections.helpSupport.contactInfo.bdaWebsite')}</strong>{' '}
                <a 
                  href="https://www.bdakarnataka.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="link-external"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <ExternalLink size={14} />
                  https://www.bdakarnataka.gov.in/
                </a>
              </p>
              <p className="contact-group-bda-queries">
                <strong>{t('infoPage.sections.helpSupport.contactInfo.bdaQueries')}</strong><br />
                <span className="contact-phone-numbers">
                  <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                      <a href="tel:+919843166622">98431 66622</a>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {' '}{t('infoPage.sections.helpSupport.contactInfo.or')}{' '}
                    </span>
                    <a 
                      href="https://x.com/BDAOfficialGok" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="link-external"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <ExternalLink size={14} />
                      @BDAOfficialGok
                    </a>
                  </span>
                </span>
              </p>
              <p className="contact-eauction-process contact-group-eauction">
                <strong>{t('infoPage.sections.helpSupport.contactInfo.eAuctionProcess')}</strong>
                <span className="contact-phone-numbers">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+918046010000">080-46010000</a>
                  </span>
                  <span className="contact-phone-separator"> | </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+918068948777">080-68948777</a>
                  </span>
                  <span className="contact-phone-separator"> | </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+919240214000">+91 9240214000</a>
                  </span>
                  <span className="contact-phone-separator"> | </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+919240214001">+91 9240214001</a>
                  </span>
                </span>
              </p>
              <p className="contact-group-timings">
                <strong>{t('infoPage.sections.helpSupport.contactInfo.timings')}</strong>{' '}{t('infoPage.sections.helpSupport.contactInfo.timingsValue')}
              </p>
              <p className="contact-group-holidays">
                <strong>{t('infoPage.sections.helpSupport.contactInfo.holidays')}</strong><br />
                {t('infoPage.sections.helpSupport.contactInfo.holidaysText')}{' '}
                <a 
                  href="https://cleartax.in/s/karnataka-governmnet-holidays-list-2026" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="link-external"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <ExternalLink size={14} />
                  {t('infoPage.sections.helpSupport.contactInfo.holidaysLink')}
                </a>
              </p>
              <p className="contact-cac contact-group-cac">
                <strong>{t('infoPage.sections.helpSupport.contactInfo.cac')}</strong><br />
                <span className="contact-phone-numbers">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+919483166622">+91 94831 66622</a>
                  </span>
                </span>
                <br />
                {t('infoPage.sections.helpSupport.contactInfo.cacPhoneWa')}
              </p>
            </div>
            <div className="warning-text">
              <strong>{t('infoPage.sections.helpSupport.contactInfo.important')}</strong> {t('infoPage.sections.helpSupport.contactInfo.importantText')}
            </div>
          </div>
        </section>
          </div>
        </div>
      </div>
      
      <div ref={footerRef} className="home-footer">
        <div className="built-by">
          <button 
            onClick={() => setShowDisclaimerModal(true)}
            className="footer-disclaimer-link"
          >
            {t('infoPage.footer.disclaimerLabel')}
          </button>
          <span className="footer-separator">|</span>
          <span>{t('infoPage.footer.builtBy')} <a href="https://zencitizen.in/" target="_blank" rel="noopener noreferrer">Zen Citizen</a></span>
          <span className="footer-separator">|</span>
          <a href="https://zencitizen.in/contact-us/" target="_blank" rel="noopener noreferrer">{t('infoPage.footer.shareFeedback')}</a>
        </div>
      </div>

      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent onClose={() => setShowDisclaimerModal(false)}>
          <DialogHeader>
            <DialogTitle>{t('infoPage.footer.disclaimerLabel')}</DialogTitle>
          </DialogHeader>
          <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <Trans
              i18nKey="infoPage.footer.disclaimer"
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

export default InfoPage
