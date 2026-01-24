import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import InfoPage from './pages/InfoPage'
import LanguageToggle from './components/LanguageToggle'
import { Button } from "@/components/ui/button"

function Navigation() {
  const location = useLocation()
  const { t } = useTranslation()
  
  return (
    <nav className="border-b border-[#4B2840]" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, rgba(75, 40, 64, 0.05) 100%)' }}>
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4 flex justify-between items-center gap-2 overflow-x-hidden">
        <Link to="/" className="text-base sm:text-xl font-semibold text-[#333] hover:opacity-90 whitespace-nowrap flex-shrink-0">
          {t('common.nav.brand')}
        </Link>
        <div className="flex gap-0.5 sm:gap-2 items-center flex-nowrap min-w-0 flex-shrink">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-base px-2 sm:px-4 py-2.5 !transition-none hover:!bg-transparent flex-shrink-0 ${location.pathname === '/' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/">{t('common.nav.home')}</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-base px-2 sm:px-4 py-2.5 !transition-none hover:!bg-transparent flex-shrink-0 ${location.pathname === '/map' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/map">
              <span className="sm:hidden">{t('common.nav.mapViewShort')}</span>
              <span className="hidden sm:inline">{t('common.nav.mapView')}</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-base px-2 sm:px-4 py-2.5 !transition-none hover:!bg-transparent flex-shrink-0 ${location.pathname === '/info' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/info">
              <span className="sm:hidden">{t('common.nav.eAuctionInfoShort')}</span>
              <span className="hidden sm:inline">{t('common.nav.eAuctionInfo')}</span>
            </Link>
          </Button>
          {/* Language toggle - desktop only, inside nav */}
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
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
      <div className="min-h-screen flex flex-col">
        <Navigation />
        {/* Language toggle - mobile only, below nav bar */}
        <div className="sm:hidden container mx-auto px-3 sm:px-4 pt-2 pb-0.5 flex justify-end items-center">
          <LanguageToggle />
        </div>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/info" element={<InfoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
