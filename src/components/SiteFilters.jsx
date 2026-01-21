import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import SearchIcon from './icons/SearchIcon'

function SiteFilters({ layouts, biddingSessions, filters, onFilterChange, onSearchChange }) {
  return (
    <Card className="border-0 shadow-none rounded-none">
      <CardContent className="pt-3 pb-4 px-6">
        <div className="flex flex-row gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="search">Search</Label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#4B2840', pointerEvents: 'none', zIndex: 1 }}>
                <SearchIcon size={24} />
              </span>
              <Input
                id="search"
                type="text"
                placeholder="Search by site number or layout"
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 py-1.5"
                style={{ paddingLeft: '2.5rem' }}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="biddingSession">Filter by Bidding Dates</Label>
            <Select
              id="biddingSession"
              value={filters.biddingSession}
              onChange={(e) => onFilterChange('biddingSession', e.target.value)}
              className="h-9 py-1.5"
            >
              <option value="">All Rounds</option>
              {biddingSessions.map(session => (
                <option key={session.value} value={session.value}>
                  {session.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="flex-1 min-w-[180px] space-y-2">
            <Label htmlFor="layout">Filter by Layout</Label>
            <Select
              id="layout"
              value={filters.layout}
              onChange={(e) => onFilterChange('layout', e.target.value)}
              className="h-9 py-1.5"
            >
              <option value="">All Layouts</option>
              {layouts.map(layout => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex-1 min-w-[180px] space-y-2">
            <Label htmlFor="siteSize">Filter by Site Size</Label>
            <Select
              id="siteSize"
              value={filters.siteSize}
              onChange={(e) => onFilterChange('siteSize', e.target.value)}
              className="h-9 py-1.5"
            >
              <option value="">All Sizes</option>
              <option value="0-600">0-600 sq.m</option>
              <option value="600-1200">600-1200 sq.m</option>
              <option value="1200-2400">1200-2400 sq.m</option>
              <option value=">2400">&gt;2400 sq.m</option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SiteFilters
