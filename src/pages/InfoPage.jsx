import { ExternalLink } from 'lucide-react'
import PhoneIcon from '../components/icons/PhoneIcon'
import DocumentsIcon from '../components/icons/DocumentsIcon'
import WhereToBidIcon from '../components/icons/WhereToBidIcon'
import CalendarIcon from '../components/icons/CalendarIcon'
import MoneyIcon from '../components/icons/MoneyIcon'
import PaymentDetailsIcon from '../components/icons/PaymentDetailsIcon'
import ImportantIcon from '../components/icons/ImportantIcon'
import HelpSupportIcon from '../components/icons/HelpSupportIcon'
import './InfoPage.css'

function InfoPage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header-sticky">
          <h1>Auction Information & Guidelines</h1>
        </div>
        <div className="info-content">

        <section className="info-section">
          <h2>What is being auctioned</h2>
          <p>
            Residential & Commercial Corner / Intermediate Sites at multiple BDA layouts across Bengaluru.
          </p>
          <p>
            <strong>Note:</strong> Auction on "AS IS WHERE IS" basis. Physical inspection of sites is strongly advised before bidding.
          </p>
        </section>

        <section className="info-section">
          <h2>Who can participate?</h2>
          <ul>
            <li>Indian citizens (individuals)</li>
            <li>Registered partnership firms in India</li>
            <li>Minors / persons without computer knowledge through guardians or representatives</li>
            <li>Joint registration permitted only for blood relations (spouse, sons, unmarried daughters)</li>
          </ul>
        </section>

        <section className="info-section">
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

        <section className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <WhereToBidIcon size={28} />
            </span>
            Where to Bid
          </h2>
          <p>
            <strong>e-Auction Portal:</strong>
            <a href="https://kppp.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.75rem', fontWeight: '600' }}>
              <ExternalLink size={14} />
              https://kppp.karnataka.gov.in/
            </a>
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <CalendarIcon size={28} />
            </span>
            Important Dates
          </h2>
          <div className="dates-timeline">
            <div className="timeline-item">
              <div className="timeline-date">13 Feb 2026</div>
              <div className="timeline-content">
                <h3>Last date to express interest</h3>
                <p>Up to 5:00 PM IST</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">16 - 17 Feb 2026</div>
              <div className="timeline-content">
                <h3>Live bidding - Round 1 (Sites 1 - 42)</h3>
                <p>
                  <strong>Starts:</strong> 16.02.2026 at 11:00 AM IST<br />
                  <strong>Closes:</strong> 17.02.2026 at 5:00 PM IST<br />
                  <strong>Delta time:</strong> 5 minutes
                </p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">17 - 18 Feb 2026</div>
              <div className="timeline-content">
                <h3>Live bidding - Round 2 (Sites 43 - 83)</h3>
                <p>
                  <strong>Starts:</strong> 17.02.2026 at 11:00 AM IST<br />
                  <strong>Closes:</strong> 18.02.2026 at 5:00 PM IST<br />
                  <strong>Delta time:</strong> 5 minutes
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <MoneyIcon size={28} />
            </span>
            Financials
          </h2>
          
          <div className="financial-item">
            <div className="financial-subsection">
              <h3>Earnest Money Deposit (EMD)</h3>
              <p className="financial-text-block"><strong>Amount:</strong> Rs. 4.00 Lakhs per site</p>
              <div className="warning-text">
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#4B2840', display: 'inline-flex', alignItems: 'flex-start', paddingTop: '0.2em', flexShrink: 0 }}>
                    <ImportantIcon size={18} />
                  </span>
                  <span>
                    EMD payment must be made ONLY on the e-Auction website:{' '}
                    <a href="https://kppp.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="link-external" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                      <ExternalLink size={14} />
                      https://kppp.karnataka.gov.in/
                    </a>
                    <br />
                    <br />
                    If EMD payment is remitted to BDA's account instead of e-Auction Portal, a 5% Service charge on EMD will be deducted during refund.
                  </span>
                </span>
              </div>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3>Bidding Requirements</h3>
              <ul>
                <li>Bid must exceed base price by at least 10%. Exact base price is site-specific and mentioned in the tables.</li>
                <li>Bid increment: Minimum Rs. 500 per sq.m</li>
              </ul>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3>Payment after Winning</h3>
              <ul>
                <li>25% of total cost (after adjusting EMD) within stipulated time</li>
                <li>Balance 75% within 45 days from allotment letter</li>
                <li>Failure results in forfeiture of EMD</li>
              </ul>
            </div>

            <hr className="financial-divider" />

            <div className="financial-subsection">
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4B2840' }}>
                  <PaymentDetailsIcon size={28} />
                </span>
                Payment Details
              </h3>
              <div className="payment-details">
                <p><strong>Bank:</strong> Canara Bank, BDA Complex Branch, Kumara Krupa West, Bengaluru-560020</p>
                <p><strong>Account Name:</strong> Bangalore Development Authority, Bengaluru</p>
                <p><strong>Account Number:</strong> 2828101053014</p>
                <p><strong>IFSC Code:</strong> CNRB0002828</p>
                <p><strong>Mode of Payment:</strong> RTGS / NEFT</p>
              </div>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>Important Cautions</h2>
          <ul className="caution-list">
            <li>Minimum two bidders required per site</li>
            <li>BDA reserves right to accept or reject any bid</li>
            <li>Sites once allotted will not be cancelled or substituted</li>
            <li>All disputes subject to Bengaluru jurisdiction only</li>
          </ul>
        </section>

        <section className="info-section">
          <h2 className="info-section-heading-with-icon">
            <span style={{ color: '#4B2840' }}>
              <HelpSupportIcon size={28} />
            </span>
            Help & Support
          </h2>
          
          <div className="help-item">
            <h3>Demonstration & Learning</h3>
            <p>
              For demonstration of live bidding & learning the process of bidding, you can visit BDA Head Office during office hours.
            </p>
            <p>
              <strong>Address:</strong> T. Chowdaiah Road, Kumara Park West, Bengaluru – 560 020
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
              <li>'Direct Supplier registration (Direction Auction)' in the section 'New Registration user manuals'</li>
              <li>'Pre-Qualified Auction Bid Submission & Live Bidding' in the section 'Bid submission user manuals'</li>
            </ul>
          </div>

          <div className="help-item">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <p>
                <strong>BDA Site-related queries:</strong><br />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                  <span>
                    <a href="tel:+918023368435">080-23368435</a> / <a href="tel:+9123368036">23368036</a>
                  </span>
                </span>
              </p>
              <p>
                <strong>For information on the e-Auction process:</strong><br />
                Karnataka Public Procurement Portal:{' '}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <PhoneIcon size={18} style={{ flexShrink: 0 }} />
                  <span>
                    <a href="tel:+918046010000">080-46010000</a> & <a href="tel:+918068948777">080-68948777</a>
                  </span>
                </span>
              </p>
            </div>
            <div className="warning-text">
              <strong>Important:</strong> Bidders are requested to contact BDA directly for any questions and avoid middlemen.
            </div>
          </div>
        </section>
        </div>

        <div className="cta-footer">
          <div className="cta-box">
            <div className="cta-content">
              <div className="cta-text">
                <div className="cta-heading">Ready to Participate?</div>
                <div className="cta-description">Visit the official e-Auction portal to register and place your bids.</div>
              </div>
              <a 
                href="https://kppp.karnataka.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary-large"
              >
                Go to Auction Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoPage
