# BDA e-Auction Site Interface

A simple, clean web interface for citizens to view and explore BDA [https://www.bdakarnataka.gov.in/] (Bangalore Development Authority) auction sites for residential properties.

## Features

- **Interactive Map View**: Explore all 83 auction sites on an interactive map powered by OpenStreetMap
- **Site Filtering & Search**: Filter sites by layout, bidding session, or search by site number/location
- **Detailed Site Information**: View comprehensive details for each site including dimensions, area, and coordinates
- **Auction Information**: Complete information about eligibility, documents required, financials, and terms & conditions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── MapView.jsx      # Interactive map component
│   │   ├── SiteFilters.jsx  # Filter and search controls
│   │   ├── SiteList.jsx     # List of sites sidebar
│   │   └── SiteDetailsModal.jsx  # Site details popup
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── MapPage.jsx      # Map view page
│   │   └── InfoPage.jsx     # Auction information page
│   ├── data/
│   │   └── sites.json       # Processed site data (generated)
│   └── App.jsx              # Main app component with routing
├── scripts/
│   └── processData.js       # CSV to JSON converter
├── sites.csv                # Source site data
├── reference.txt            # Auction information source
└── PLAN.md                  # Implementation plan

```

## Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Process site data (if needed):**
   ```bash
   node scripts/processData.js
   ```
   This converts `sites.csv` to `src/data/sites.json`

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

### Development
- Run `npm run dev` to start the Vite development server
- The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Production
- Run `npm run build` to create an optimized production build
- The built files will be in the `dist/` directory
- Deploy the `dist/` directory to any static hosting service

## Data Updates

If you need to update the site data:

1. Update `sites.csv` with new site information
2. Run `node scripts/processData.js` to regenerate `src/data/sites.json`
3. The changes will be reflected in the application

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Leaflet** - Map component library
- **Leaflet** - Interactive maps
- **OpenStreetMap** - Free map tiles

## Browser Support

Modern browsers that support ES6+ features:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

