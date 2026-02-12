import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronUp, ChevronDown } from 'lucide-react'
import './TermsAndConditionsPage.css'

function TermsAndConditionsPage() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('terms-and-conditions')
  const [menuExpanded, setMenuExpanded] = useState(false)
  const isScrollingProgrammatically = useRef(false)
  const scrollTimeoutRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const sections = [
      'terms-and-conditions',
      'eligibility',
      'bidder-identity-ownership',
      'risk-acceptance',
      'bid-validity',
      'bda-discretion',
      'emd-handling',
      'payment-obligations',
      'dimension-differences',
      'statutory-disclosures'
    ]

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
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

    // Handle scroll events for the last section (statutory-disclosures)
    // since it might not trigger intersection observer properly at the bottom
    const handleScroll = () => {
      if (isScrollingProgrammatically.current) {
        return
      }
      
      // Check if we're near the bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const isNearBottom = scrollPosition >= documentHeight - 100 // Within 100px of bottom
      
      if (isNearBottom) {
        const statutoryDisclosuresEl = document.getElementById('statutory-disclosures')
        if (statutoryDisclosuresEl) {
          const rect = statutoryDisclosuresEl.getBoundingClientRect()
          // If the section is visible in viewport
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            setActiveSection('statutory-disclosures')
          }
        }
      }
    }

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    // Add scroll listener for better detection of last section
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Also check on initial load
    handleScroll()

    return () => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.unobserve(element)
        }
      })
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      setActiveSection(sectionId)
      
      isScrollingProgrammatically.current = true

      const headerOffset = 160
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingProgrammatically.current = false
        scrollTimeoutRef.current = null
      }, 1000)

      if (window.innerWidth <= 768) {
        setMenuExpanded(false)
      }
    }
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

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
    <div className="info-page">
      <div className="info-container">
        <div className="info-header-sticky">
          <h1>{t('termsAndConditionsPage.title')}</h1>
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
              <div className="info-menu-title">{t('termsAndConditionsPage.menu.contents')}</div>
              <a 
                href="#terms-and-conditions" 
                onClick={(e) => handleMenuClick(e, 'terms-and-conditions')}
                className={activeSection === 'terms-and-conditions' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.termsAndConditions')}
              </a>
              <a 
                href="#eligibility"
                onClick={(e) => handleMenuClick(e, 'eligibility')}
                className={activeSection === 'eligibility' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.eligibility')}
              </a>
              <a 
                href="#bidder-identity-ownership"
                onClick={(e) => handleMenuClick(e, 'bidder-identity-ownership')}
                className={activeSection === 'bidder-identity-ownership' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.bidderIdentityOwnership')}
              </a>
              <a 
                href="#risk-acceptance"
                onClick={(e) => handleMenuClick(e, 'risk-acceptance')}
                className={activeSection === 'risk-acceptance' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.riskAcceptance')}
              </a>
              <a 
                href="#bid-validity"
                onClick={(e) => handleMenuClick(e, 'bid-validity')}
                className={activeSection === 'bid-validity' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.bidValidity')}
              </a>
              <a 
                href="#bda-discretion"
                onClick={(e) => handleMenuClick(e, 'bda-discretion')}
                className={activeSection === 'bda-discretion' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.bdaDiscretion')}
              </a>
              <a 
                href="#emd-handling"
                onClick={(e) => handleMenuClick(e, 'emd-handling')}
                className={activeSection === 'emd-handling' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.emdHandling')}
              </a>
              <a 
                href="#payment-obligations"
                onClick={(e) => handleMenuClick(e, 'payment-obligations')}
                className={activeSection === 'payment-obligations' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.paymentObligations')}
              </a>
              <a 
                href="#dimension-differences"
                onClick={(e) => handleMenuClick(e, 'dimension-differences')}
                className={activeSection === 'dimension-differences' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.dimensionDifferences')}
              </a>
              <a 
                href="#statutory-disclosures"
                onClick={(e) => handleMenuClick(e, 'statutory-disclosures')}
                className={activeSection === 'statutory-disclosures' ? 'active' : ''}
              >
                {t('termsAndConditionsPage.menu.statutoryDisclosures')}
              </a>
            </nav>
          </aside>
          <div className="info-content">
            <section id="terms-and-conditions" className="info-section">
              <h2>{t('termsAndConditionsPage.sections.termsAndConditions.title')}</h2>
              <p>
                {t('termsAndConditionsPage.sections.termsAndConditions.description')}
              </p>
            </section>

            <section id="bidding-stage" className="info-section">
              <h2>{t('termsAndConditionsPage.sections.biddingStage.title')}</h2>
              
              <div id="eligibility" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.biddingStage.eligibility.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.biddingStage.eligibility.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div id="bidder-identity-ownership" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.biddingStage.bidderIdentityOwnership.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.biddingStage.bidderIdentityOwnership.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div id="risk-acceptance" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.biddingStage.riskAcceptance.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.biddingStage.riskAcceptance.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div id="bid-validity" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.biddingStage.bidValidity.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.biddingStage.bidValidity.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div id="bda-discretion" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.biddingStage.bdaDiscretion.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.biddingStage.bdaDiscretion.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="allotment-payment" className="info-section">
              <h2>{t('termsAndConditionsPage.sections.allotmentPayment.title')}</h2>
              
              <div id="emd-handling" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.allotmentPayment.emdHandling.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.allotmentPayment.emdHandling.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div id="payment-obligations" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.title')}</h3>
                <p>
                  {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.description')}
                </p>
                <div className="payment-details-subsection" style={{ marginTop: '1rem' }}>
                  <p><strong>{t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.accountName')}</strong> {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.accountNameValue')}</p>
                  <p><strong>{t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.bank')}</strong> {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.bankValue')}</p>
                  <p><strong>{t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.accountNumber')}</strong> {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.accountNumberValue')}</p>
                  <p><strong>{t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.ifscCode')}</strong> {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.ifscCodeValue')}</p>
                  <p><strong>{t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.modeOfPayment')}</strong> {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.modeOfPaymentValue')}</p>
                </div>
                <p style={{ marginTop: '1rem' }}>
                  {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.challan')}
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ marginTop: '0', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#333' }}>
                    {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.forfeiture.title')}
                  </h4>
                  <ul>
                    {t('termsAndConditionsPage.sections.allotmentPayment.paymentObligations.forfeiture.items', { returnObjects: true }).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div id="dimension-differences" className="info-subsection">
                <h3>{t('termsAndConditionsPage.sections.allotmentPayment.dimensionDifferences.title')}</h3>
                <ul>
                  {t('termsAndConditionsPage.sections.allotmentPayment.dimensionDifferences.items', { returnObjects: true }).map((item, index) => {
                    if (typeof item === 'object' && item.rules) {
                      return (
                        <li key={index}>
                          {item.text}{' '}
                          <a 
                            href="https://www.bdakarnataka.in/api/media/about-us/pdf_press_release/Conducted_under_BDA_Disposal_of_Corner__Intermediate___Other_Auctionable_Sites_Rules__1984_1769170438464_fbcab00b.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1A73E8', textDecoration: 'underline', textUnderlineOffset: '0.25em' }}
                          >
                            {item.rules}
                          </a>
                          {item.year}
                        </li>
                      )
                    }
                    return <li key={index}>{item}</li>
                  })}
                </ul>
              </div>
            </section>

            <section id="statutory-disclosures" className="info-section">
              <h2>{t('termsAndConditionsPage.sections.statutoryDisclosures.title')}</h2>
              <ul>
                {t('termsAndConditionsPage.sections.statutoryDisclosures.items', { returnObjects: true }).map((item, index) => {
                  const items = t('termsAndConditionsPage.sections.statutoryDisclosures.items', { returnObjects: true })
                  const isLastItem = index === items.length - 1
                  
                  if (isLastItem && typeof item === 'object' && item.rules) {
                    return (
                      <li key={index}>
                        {item.text}{' '}
                        <a 
                          href="https://www.bdakarnataka.in/api/media/about-us/pdf_press_release/Conducted_under_BDA_Disposal_of_Corner__Intermediate___Other_Auctionable_Sites_Rules__1984_1769170438464_fbcab00b.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1A73E8', textDecoration: 'underline', textUnderlineOffset: '0.25em' }}
                        >
                          {item.rules}
                        </a>
                        {item.year}
                      </li>
                    )
                  }
                  
                  if (typeof item === 'object' && item.itAct) {
                    return (
                      <li key={index}>
                        {item.text}{' '}
                        <em>{item.itAct}</em>
                        {item.rest}
                      </li>
                    )
                  }
                  
                  return <li key={index}>{item}</li>
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
      
      {/* <div className="bda-endorsement">
        <img src="/bda_logo.png" alt="BDA Logo" className="bda-logo" />
        <span className="endorsement-text">{t('home.endorsement.text')}</span>
      </div> */}
      
      <div ref={footerRef} className="home-footer">
        <div className="built-by">
          <div className="footer-line-1">
            <span>{t('infoPage.footer.builtBy')} <a href="https://zencitizen.in/" target="_blank" rel="noopener noreferrer">Zen Citizen</a></span>
            <span className="footer-separator">|</span>
            <a href="https://zencitizen.in/contact-us/" target="_blank" rel="noopener noreferrer">{t('infoPage.footer.shareFeedback')}</a>
          </div>
          <span className="footer-separator footer-line-separator">|</span>
          <div className="footer-line-2">
            <a href="https://www.bdakarnataka.gov.in/" target="_blank" rel="noopener noreferrer">{t('infoPage.footer.bdaWebsite')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditionsPage
