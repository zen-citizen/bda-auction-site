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
   npm run generate-sites
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

Use this checklist for every new auction cycle.

Important: Any time `sites.csv` is changed, run `npm run generate-sites` so `src/data/sites.json` is regenerated from the latest CSV.

1. Replace `sites.csv` at the project root with the latest file for the new round.
2. Update `src/config/auctionSchedule.js`:
   - `commencement`
   - `lastDayExpressInterest`
   - `rounds[]` entries (`startDisplay`, `endDisplay`, `shortRange`, `sitesRange`)
3. Ensure every `rounds[].sitesRange` uses the format `start - end` (example: `1 - 42`).
4. Ensure ranges in `rounds[].sitesRange` cover all site serial numbers (`Sl_No`) from `sites.csv`.
5. Run:
   ```bash
   npm run generate-sites
   ```
6. Verify `src/data/sites.json` updates correctly:
   - `sites[].biddingSession` values align to round ranges from `auctionSchedule`.
   - `stats` includes per-session counts (for example `session1`, `session2`, `session3`).
7. Start app and sanity-check round filtering:
   ```bash
   npm run dev
   ```
   - Home timeline dates should match `auctionSchedule`.
   - Bidding round dropdown options should match `auctionSchedule.rounds`.
   - Selecting a round should show the correct sites for that session.
8. If publication/date text changed, update both translation files (including Home page publication date):
   - `src/i18n/locales/en/translation.json` (especially `home.publicationNumber`)
   - `src/i18n/locales/kn/translation.json` (especially `home.publicationNumber`)

### Single Source of Truth

`auctionSchedule.rounds[].sitesRange` is now the source of truth for assigning `biddingSession` during CSV parsing.  
This prevents mismatch between configured rounds and site session data.

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

