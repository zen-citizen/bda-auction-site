import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import InfoPage from './pages/InfoPage'
import { Button } from "@/components/ui/button"

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="text-lg sm:text-xl font-semibold hover:opacity-90 whitespace-nowrap">
          BDA e-Auction
        </Link>
        <div className="flex gap-1.5 sm:gap-2">
          <Button
            asChild
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            size="sm"
            className="text-sm sm:text-base px-2.5 sm:px-4 py-1.5 sm:py-2.5"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            asChild
            variant={location.pathname === '/map' ? 'default' : 'ghost'}
            size="sm"
            className="text-sm sm:text-base px-2.5 sm:px-4 py-1.5 sm:py-2.5"
          >
            <Link to="/map">
              <span className="sm:hidden">View</span>
              <span className="hidden sm:inline">Map View</span>
            </Link>
          </Button>
          <Button
            asChild
            variant={location.pathname === '/info' ? 'default' : 'ghost'}
            size="sm"
            className="text-sm sm:text-base px-2.5 sm:px-4 py-1.5 sm:py-2.5"
          >
            <Link to="/info">
              <span className="sm:hidden">Info</span>
              <span className="hidden sm:inline">Auction Info</span>
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
