import { useState, useEffect } from 'react'
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import PhoneIcon from '../components/icons/PhoneIcon'
import DocumentsIcon from '../components/icons/DocumentsIcon'
import WhereToBidIcon from '../components/icons/WhereToBidIcon'
import CalendarIcon from '../components/icons/CalendarIcon'
import MoneyIcon from '../components/icons/MoneyIcon'
import ImportantIcon from '../components/icons/ImportantIcon'
import HelpSupportIcon from '../components/icons/HelpSupportIcon'
import './InfoPage.css'

function InfoPage() {
  const [activeSection, setActiveSection] = useState('what-is-being-eauctioned')
  const [menuExpanded, setMenuExpanded] = useState(false)

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
      const headerOffset = 160
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Close menu on mobile after clicking
      if (window.innerWidth <= 768) {
        setMenuExpanded(false)
      }
    }
  }

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header-sticky">
          <h1>eAuction Information & Guidelines</h1>
        </div>
        <div className="info-page-layout">
          <aside className="info-sidebar">
            <button
              className="info-menu-toggle-mobile"
              onClick={toggleMenu}
              aria-expanded={menuExpanded}
              aria-label="Toggle contents menu"
            >
              <span className="info-menu-toggle-label">Contents</span>
              {menuExpanded ? (
                <ChevronUp className="info-menu-toggle-icon" size={20} />
              ) : (
                <ChevronDown className="info-menu-toggle-icon" size={20} />
              )}
            </button>
            <nav className={`info-menu ${menuExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="info-menu-title">Contents</div>
              <a 
                href="#what-is-being-eauctioned" 
                onClick={(e) => handleMenuClick(e, 'what-is-being-eauctioned')}
                className={activeSection === 'what-is-being-eauctioned' ? 'active' : ''}
              >
                What is being eAuctioned
              </a>
              <a 
                href="#who-can-participate"
                onClick={(e) => handleMenuClick(e, 'who-can-participate')}
                className={activeSection === 'who-can-participate' ? 'active' : ''}
              >
                Who can participate?
              </a>
              <a 
                href="#documents-required"
                onClick={(e) => handleMenuClick(e, 'documents-required')}
                className={activeSection === 'documents-required' ? 'active' : ''}
              >
                Documents Required
              </a>
              <a 
                href="#where-to-bid"
                onClick={(e) => handleMenuClick(e, 'where-to-bid')}
                className={activeSection === 'where-to-bid' ? 'active' : ''}
              >
                Where to Bid
              </a>
              <a 
                href="#important-dates"
                onClick={(e) => handleMenuClick(e, 'important-dates')}
                className={activeSection === 'important-dates' ? 'active' : ''}
              >
                Important Dates
              </a>
              <a 
                href="#financials"
                onClick={(e) => handleMenuClick(e, 'financials')}
                className={activeSection === 'financials' ? 'active' : ''}
              >
                Financials
              </a>
              <a 
                href="#important-cautions"
                onClick={(e) => handleMenuClick(e, 'important-cautions')}
                className={activeSection === 'important-cautions' ? 'active' : ''}
              >
                Important Cautions
              </a>
              <a 
                href="#help-support"
                onClick={(e) => handleMenuClick(e, 'help-support')}
                className={activeSection === 'help-support' ? 'active' : ''}
              >
                Help & Support
              </a>
            </nav>
          </aside>
          <div className="info-content">

        <section id="what-is-being-eauctioned" className="info-section">
          <h2>What is being eAuctioned</h2>
          <p>
          Residential Sites at multiple BDA layouts across Bengaluru
          </p>
          <p>
            <strong>Note:</strong> eAuction on "AS IS WHERE IS" basis. Physical inspection of sites is strongly advised before bidding.
          </p>
        </section>

        <section id="who-can-participate" className="info-section">
          <h2>Who can participate?</h2>
          <ul>
            <li>Indian citizens (individuals)</li>
            <li>Registered partnership firms in India</li>
            <li>Minors or persons without computer knowledge through guardians or representatives</li>
            <li>Joint registration permitted only for blood relations (spouse, sons, unmarried daughters) Proof of relationship required</li>
          </ul>
        </section>

        <section id="documents-required" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <DocumentsIcon size={28} />
            </span>
            Documents Required
          </h2>
          <ul>
            <li>PAN Card (attested)</li>
            <li>Photo & Signature (prescribed format in Appendix)</li>
            <li>Any one address proof (attested):
              <ul>
                <li>Aadhaar</li>
                <li>Voter ID</li>
                <li>Passport</li>
                <li>Driving Licence</li>
              </ul>
            </li>
          </ul>
        </section>

        <section id="where-to-bid" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <WhereToBidIcon size={28} />
            </span>
            Where to Bid
          </h2>
          <p>
            <strong>eAuction Portal:</strong>
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
            Important Dates
          </h2>
          <div className="dates-timeline">
            <div className="timeline-item">
              <div className="timeline-date">27 January 2026</div>
              <div className="timeline-content">
                <h3>Commencement of eAuction</h3>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">13 February 2026</div>
              <div className="timeline-content">
                <h3>Last date to express interest</h3>
                <p>Up to 5:00&nbsp;PM&nbsp;IST</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">16 - 17 February 2026</div>
              <div className="timeline-content">
                <h3>Live bidding - Round 1 (Sites 1 - 42)</h3>
                <p>
                  <strong>Starts:</strong> 16 Feb 2026 at 11:00&nbsp;AM&nbsp;IST<br />
                  <strong>Closes:</strong> 17 Feb 2026 at 17:00&nbsp;PM&nbsp;IST<br />
                  <strong>Delta time:</strong> 5 minutes
                </p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">17 - 18 February 2026</div>
              <div className="timeline-content">
                <h3>Live bidding - Round 2 (Sites 43 - 83)</h3>
                <p>
                  <strong>Starts:</strong> 17 Feb 2026 at 11:00&nbsp;AM&nbsp;IST<br />
                  <strong>Closes:</strong> 18 Feb 2026 at 17:00&nbsp;PM&nbsp;IST<br />
                  <strong>Delta time:</strong> 5 minutes
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
            Financials
          </h2>
          
          <div className="financial-item">
            <div className="financial-subsection">
              <h3>Earnest Money Deposit (EMD)</h3>
              <p className="financial-text-block"><strong>Amount:</strong> Rs. 4 Lakhs per site</p>
              <div className="warning-text">
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'flex-start', paddingTop: '0.2em', flexShrink: 0 }}>
                    <ImportantIcon size={18} />
                  </span>
                  <span>
                    EMD payment must be made ONLY on the eAuction website:{' '}
                    <a href="https://kppp.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                      <ExternalLink size={14} />
                      https://kppp.karnataka.gov.in/
                    </a>
                    <br />
                    <br />
                    If EMD payment is remitted to BDA's account instead of eAuction Portal, a 5% Service charge on EMD will be deducted during refund.
                  </span>
                </span>
              </div>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3>Bidding Requirements</h3>
              <ul>
                <li>Bid must exceed base price by at least 10%</li>
                <li>Bid increment: Minimum Rs. 500 per sq.m</li>
              </ul>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3>Payment after Winning</h3>
              <ul>
                <li>25% of total cost (after adjusting EMD) within stipulated time of 3 days</li>
                <li>Balance 75% within 45 days from allotment letter</li>
              </ul>
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginTop: '0', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#333' }}>
                  Payment Details
                </h4>
                <div className="payment-details-subsection">
                <p><strong>Account Name:</strong> Bangalore Development Authority, Bengaluru</p>
                  <p><strong>Bank:</strong> Canara Bank, BDA Complex Branch, Kumara Krupa West, Bengaluru-560020</p>
                  <p><strong>Account Number:</strong> 2828101053014</p>
                  <p><strong>IFSC Code:</strong> CNRB0002828</p>
                  <p><strong>Mode of Payment:</strong> RTGS / NEFT</p>
                </div>
              </div>
              <div className="warning-text" style={{ marginTop: '1rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'flex-start', paddingTop: '0.2em', flexShrink: 0 }}>
                    <ImportantIcon size={18} />
                  </span>
                  <span>Failure of making payment within stipulated time will result in forfeiture of EMD</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="important-cautions" className="info-section">
          <h2>Important Cautions</h2>
          <ul className="caution-list">
            <li>Minimum two bidders required per site</li>
            <li>BDA reserves right to accept or reject any bid</li>
            <li>Sites once allotted will not be cancelled or substituted</li>
            <li>All disputes subject to Bengaluru jurisdiction only</li>
          </ul>
        </section>

        <section id="help-support" className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <HelpSupportIcon size={28} />
            </span>
            Help & Support
          </h2>
          
          <div className="help-item">
            <h3>Demo</h3>
            <p>
              For demonstration of live bidding & learning the process of bidding, you can visit BDA Head Office during office hours.
            </p>
            <p>
              <strong>Address:</strong>{' '}
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
              <strong>Note:</strong> Bidding by BDA on behalf of a bidder shall not be undertaken during the demonstration.
            </p>
          </div>

          <div className="help-item">
            <h3>Video Tutorials</h3>
            <p>
              <a href="https://kppp.karnataka.gov.in/#/portal/download-user-manuals-tenders" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ExternalLink size={14} />
                Download User Manuals & Videos
              </a>
            </p>
            <p className="note-text">
              Refer to:
            </p>
            <ul>
              <li>'Direct Supplier registration (Direction eAuction)' in the section 'New Registration user manuals'</li>
              <li>'Pre-Qualified eAuction Bid Submission & Live Bidding' in the section 'Bid submission user manuals'</li>
            </ul>
          </div>

          <div className="help-item">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <p>
                <strong>BDA Site-related queries:</strong><br />
                <span className="contact-phone-numbers">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+918023368435">080-23368435</a>
                  </span>
                  <span className="contact-phone-separator"> | </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                    <a href="tel:+918023368036">080-23368036</a>
                  </span>
                </span>
              </p>
              <p>
                <strong>For information on the eAuction process:</strong><br />
                Karnataka Public Procurement Portal:{' '}
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
                </span>
              </p>
              <p>
                eProcurement Helpdesk:<br />
                <span className="contact-phone-numbers">
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
              <p>
                <strong>BDA on X (Twitter):</strong><br />
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
              </p>
            </div>
            <div className="warning-text">
              <strong>Important:</strong> Bidders are requested to contact BDA directly for any questions and avoid middlemen.
            </div>
          </div>
        </section>
          </div>
        </div>
      </div>
      
      <div className="home-footer">
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

export default InfoPage
