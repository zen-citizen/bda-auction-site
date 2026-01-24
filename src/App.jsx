import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import InfoPage from './pages/InfoPage'
import { Button } from "@/components/ui/button"

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="border-b border-[#4B2840]" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, rgba(75, 40, 64, 0.05) 100%)' }}>
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="text-lg sm:text-xl font-semibold text-[#333] hover:opacity-90 whitespace-nowrap">
          BDA eAuction
        </Link>
        <div className="flex gap-1.5 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-sm sm:text-base px-2.5 sm:px-4 py-1.5 sm:py-2.5 !transition-none hover:!bg-transparent ${location.pathname === '/' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`text-sm sm:text-base px-2.5 sm:px-4 py-1.5 sm:py-2.5 !transition-none hover:!bg-transparent ${location.pathname === '/map' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
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
            className={`text-sm sm:text-base px-2.5 sm:px-4 py-1.5 sm:py-2.5 !transition-none hover:!bg-transparent ${location.pathname === '/info' ? '!text-[#4B2840] font-semibold underline underline-offset-4' : '!text-[#666] hover:!text-[#4B2840]'}`}
          >
            <Link to="/info">
              <span className="sm:hidden">Info</span>
              <span className="hidden sm:inline">eAuction Info</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
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
