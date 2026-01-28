import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import InfoPage from './pages/InfoPage'
import TermsAndConditionsPage from './pages/TermsAndConditionsPage'
import LanguageToggle from './components/LanguageToggle'
import { Button } from "@/components/ui/button"

function Navigation() {
  const location = useLocation()
  const { t } = useTranslation()
  
  return (
    <nav className="border-b border-[#4B2840]">
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4 nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand text-base sm:text-xl font-semibold text-[#333] hover:opacity-90 whitespace-nowrap flex-shrink-0">
          {t('common.nav.brand')}
        </Link>
        {/* Nav items - centered on mobile, right-aligned on desktop */}
        <div className="nav-items flex gap-0.5 sm:gap-2 items-center flex-nowrap min-w-0 flex-shrink">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-base px-2 sm:px-4 py-2.5 !transition-none hover:!bg-transparent flex-shrink-0 ${location.pathname === '/' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-base px-2 sm:px-4 py-2.5 !transition-none hover:!bg-transparent flex-shrink-0 ${location.pathname === '/map' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/map">
              <span className="sm:hidden">View</span>
              <span className="hidden sm:inline">Map View</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-base px-2 sm:px-4 py-2.5 !transition-none hover:!bg-transparent flex-shrink-0 ${location.pathname === '/info' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/info">
              <span className="sm:hidden">Info</span>
              <span className="hidden sm:inline">eAuction Info</span>
            </Link>
          </Button>
        </div>
        {/* Language toggle - always visible in nav */}
        <div className="nav-language flex-shrink-0">
          <LanguageToggle />
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/t&c" element={<TermsAndConditionsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  const { i18n } = useTranslation()
  
  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en'
  }, [i18n.language])
  
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
