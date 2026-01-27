# BDA e-Auction Site Interface

A simple, clean web interface for citizens to view and explore [BDA](https://www.bdakarnataka.gov.in) (Bangalore Development Authority) auction sites for residential properties.

## Features

- **Interactive Map View**: Explore all 83 auction sites on an interactive map powered by OpenStreetMap
- **Site Filtering & Search**: Filter sites by layout, bidding round and size or search by site number/layout
- **Detailed Site Information**: View comprehensive details for each site including dimensions, area, coordinates and site boundaries
- **Auction Information**: Complete information about eligibility, documents required, financials, and terms & conditions

## Project Structure


```
/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── icons/           # Icon components
│   │   │   ├── AreaIcon.jsx
│   │   │   ├── AuctionInfoIcon.jsx
│   │   │   ├── CalendarIcon.jsx
│   │   │   ├── DocumentsIcon.jsx
│   │   │   ├── EWIcon.jsx
│   │   │   ├── ExternalLinkIcon.jsx
│   │   │   ├── HelpSupportIcon.jsx
│   │   │   ├── ImportantIcon.jsx
│   │   │   ├── MapIcon.jsx
│   │   │   ├── MoneyIcon.jsx
│   │   │   ├── NSIcon.jsx
│   │   │   ├── PaymentDetailsIcon.jsx
│   │   │   ├── PhoneIcon.jsx
│   │   │   ├── SearchIcon.jsx
│   │   │   ├── SelectMarkerIcon.jsx
│   │   │   ├── SitesIcon.jsx
│   │   │   └── WhereToBidIcon.jsx
│   │   ├── ui/              # UI component library
│   │   │   ├── alert.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   └── select.jsx
│   │   ├── MapView.jsx      # Interactive map component
│   │   ├── MapView.css
│   │   ├── SiteFilters.jsx  # Filter and search controls
│   │   ├── SiteFilters.css
│   │   ├── SiteList.jsx     # List of sites sidebar
│   │   ├── SiteList.css
│   │   ├── SiteDetailsModal.jsx  # Site details popup
│   │   ├── SiteDetailsModal.css
│   │   ├── SiteItemTooltip.jsx    # Site tooltip component
│   │   ├── LanguageToggle.jsx     # Language switcher
│   │   └── zc-logo.svg      # Logo asset
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Home.css
│   │   ├── MapPage.jsx      # Map view page
│   │   ├── MapPage.css
│   │   ├── InfoPage.jsx     # Auction information page
│   │   └── InfoPage.css
│   ├── data/
│   │   └── sites.json       # Processed site data (generated)
│   ├── i18n/                # Internationalization
│   │   ├── config.js        # i18n configuration
│   │   └── locales/         # Translation files
│   │       ├── en/
│   │       │   └── translation.json
│   │       └── kn/
│   │           └── translation.json
│   ├── lib/                 # Utility libraries
│   │   ├── kmlParser.js     # KML file parser
│   │   ├── shapefileParser.js  # Shapefile parser
│   │   └── utils.js         # General utilities
│   ├── App.jsx              # Main app component with routing
│   ├── App.css
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
│   ├── favicon.svg
│   └── kml.kmz              # KML map data
├── scripts/
│   └── processData.js       # CSV to JSON converter
├── sites.csv                # Source site data
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
├── components.json          # shadcn/ui components config
├── .eslintrc.cjs            # ESLint configuration
├── TRANSLATION_WORKFLOW.md  # Translation workflow documentation
└── README.md                # This file

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
- The app will be available at `http://localhost:5500` (or the port shown in terminal)

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

