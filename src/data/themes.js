// Single source of truth for categories and themes.
// Imported by both the React frontend and the /api/enquiry serverless function.

export const CATEGORIES = [
  {
    id: 'restaurant-food',
    name: 'Restaurant & Food',
    blurb: 'Menus, reservations and online ordering that make guests hungry.',
    icon: 'utensils',
    live: true,
  },
  {
    id: 'hotels-accommodation',
    name: 'Hotels & Accommodation',
    blurb: 'Resorts, boutique hotels and homestays with rooms, rates and direct booking.',
    icon: 'bed',
    live: true,
  },
  {
    id: 'salons-beauty',
    name: 'Salons & Beauty Services',
    blurb: 'Hair, skin and nail studios with service menus, stylists and appointment booking.',
    icon: 'scissors',
    live: true,
  },
  {
    id: 'rental-business',
    name: 'Rental Business',
    blurb: 'Cars, bikes, equipment and spaces — fleet listings with dates, pricing and reservations.',
    icon: 'key',
    live: true,
  },
  {
    id: 'business-services',
    name: 'Business & Services',
    blurb: 'Credible corporate sites and agencies that turn visits into calls.',
    icon: 'briefcase',
    live: true,
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    blurb: 'Property listings, agent profiles and visit scheduling for brokerages and builders.',
    icon: 'home',
    live: true,
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail & E-commerce',
    blurb: 'Storefronts with product catalogues, collections and a shopping bag.',
    icon: 'bag',
    live: true,
  },
  {
    id: 'education',
    name: 'Education',
    blurb: 'Schools, colleges and academies with programmes, admissions and campus pages.',
    icon: 'cap',
    live: true,
  },
];

export const THEMES = [
  {
    id: 'restaurant-premium-dining',
    thumb: 'dining-plate',
    look: { bg: '#fbf7f0', ink: '#1d1a16', accent: '#c8a165', font: "'Playfair Display', serif", headline: 'Fire, spice & quiet ceremony.' },
    name: 'Saffron & Smoke',
    type: 'Premium Restaurant',
    category: 'restaurant-food',
    description:
      'An elegant fine-dining theme with real food photography, a chef’s story, seasonal tasting menu and table reservations.',
    features: ['Tasting-menu layout', 'Table reservation block', 'Chef & story section', 'Photo gallery & reviews'],
    palette: ['#1d1a16', '#c8a165', '#f4ede1'],
  },
  {
    id: 'restaurant-bakery-cafe',
    thumb: 'pastries',
    look: { bg: '#fff4e6', ink: '#5b3a29', accent: '#e2725b', font: "'Fraunces', serif", headline: 'Small batches. Big smiles.' },
    name: 'Crumb & Co.',
    type: 'Bakery & Cafe',
    category: 'restaurant-food',
    description:
      'A warm, playful cafe theme with daily bakes, a coffee menu, pre-order cards and opening hours.',
    features: ['Daily specials board', 'Pre-order cards with photos', 'Opening hours & map', 'Instagram-style feed'],
    palette: ['#fff4e6', '#e2725b', '#5b3a29'],
  },
  {
    id: 'hotel-resort',
    thumb: 'resort-pool',
    look: { bg: '#f6f9fb', ink: '#0b2545', accent: '#0e7490', font: "'Cormorant Garamond', serif", headline: 'Where the sea sets the pace.' },
    name: 'Azure Bay',
    type: 'Hotel & Resort',
    category: 'hotels-accommodation',
    description:
      'A serene resort theme with a booking widget, rooms & rates, amenities, a photo gallery and guest reviews.',
    features: ['Check-in / check-out booking bar', 'Rooms & rates cards', 'Amenities & experiences', 'Gallery & guest reviews'],
    palette: ['#0b2545', '#0e7490', '#f6f9fb'],
  },
  {
    id: 'salon-beauty',
    thumb: 'salon-model',
    look: { bg: '#fdf6f4', ink: '#2b1d24', accent: '#c2607c', font: "'DM Serif Display', serif", headline: 'Look like the best version of you.' },
    name: 'Lumière Studio',
    type: 'Salon & Beauty',
    category: 'salons-beauty',
    description:
      'A polished salon theme with a service & price menu, stylist profiles, a gallery and online appointment booking.',
    features: ['Service menu with prices', 'Stylist profiles', 'Appointment booking form', 'Gallery & offers'],
    palette: ['#fdf6f4', '#c2607c', '#2b1d24'],
  },
  {
    id: 'rental-vehicles',
    thumb: 'road-trip',
    look: { bg: '#f8f8f6', ink: '#111827', accent: '#f59e0b', font: "'Space Grotesk', sans-serif", headline: 'Pick it up. Drive it anywhere.' },
    name: 'DriveNow Rentals',
    type: 'Car & Bike Rental',
    category: 'rental-business',
    description:
      'A fast, conversion-focused rental theme with a search widget, filterable fleet, transparent pricing and instant reservation.',
    features: ['Pickup & dates search bar', 'Filterable fleet grid', 'Per-day pricing & deposits', 'Reservation flow & reviews'],
    palette: ['#111827', '#f59e0b', '#f8f8f6'],
  },
  {
    id: 'realestate-agency',
    thumb: 'house-dusk',
    look: { bg: '#f7f6f2', ink: '#1f4d3a', accent: '#b8893d', font: "'Playfair Display', serif", headline: 'Find the home that feels like yours.' },
    name: 'Haven Estates',
    type: 'Real Estate Agency',
    category: 'real-estate',
    description:
      'A five-page brokerage theme: home search, filterable listings with detail pages, agent profiles, about and contact.',
    features: ['5 pages · Home, Properties, Agents, About, Contact', 'Buy / rent filters & listing details', 'Schedule-a-visit form', 'Agent profiles & valuation CTA'],
    palette: ['#1f4d3a', '#b8893d', '#f7f6f2'],
  },
  {
    id: 'retail-fashion-store',
    thumb: 'shopper',
    look: { bg: '#fafafa', ink: '#141414', accent: '#d64545', font: "'DM Serif Display', serif", headline: 'Dress for the days that matter.' },
    name: 'Nord & Thread',
    type: 'Fashion & Lifestyle Store',
    category: 'retail-ecommerce',
    description:
      'A five-page storefront with a shoppable catalogue, collections, brand story, store locator and a working shopping bag.',
    features: ['5 pages · Home, Shop, Collections, Story, Contact', 'Category filters & sale tags', 'Slide-out shopping bag', 'Collections & lookbook grid'],
    palette: ['#141414', '#d64545', '#fafafa'],
  },
  {
    id: 'education-academy',
    thumb: 'graduation',
    look: { bg: '#f5f7fb', ink: '#0f172a', accent: '#2563eb', font: "'Fraunces', serif", headline: 'Learn by doing. Graduate ready.' },
    name: 'Bright Minds Academy',
    type: 'College & Academy',
    category: 'education',
    description:
      'A five-page institution theme with programme listings, an online admissions form, campus facilities, faculty and contact.',
    features: ['5 pages · Home, Programs, Admissions, Campus, Contact', 'Programme filters by level', 'Online application form', 'Facilities, faculty & events'],
    palette: ['#0f172a', '#2563eb', '#f5f7fb'],
  },
  {
    id: 'business-corporate',
    thumb: 'meeting',
    look: { bg: '#f5f8fc', ink: '#0b1b3a', accent: '#1f4fd1', font: "'Plus Jakarta Sans', sans-serif", headline: 'Clarity for the decisions that matter.' },
    name: 'Meridian Corp',
    type: 'Corporate Website',
    category: 'business-services',
    description:
      'A trustworthy corporate theme with services, key numbers, leadership team and a contact funnel.',
    features: ['Services grid', 'Animated key metrics', 'Leadership team', 'Client logos & CTA'],
    palette: ['#f5f8fc', '#1f4fd1', '#0b1b3a'],
  },
  {
    id: 'business-digital-agency',
    thumb: 'phone-app',
    look: { bg: '#f7f7f2', ink: '#111111', accent: '#ff4d2e', font: "'Space Grotesk', sans-serif", headline: 'We make brands impossible to ignore.' },
    name: 'Pulse Studio',
    type: 'Digital Agency',
    category: 'business-services',
    description:
      'A bold creative-agency theme with oversized type, case studies, process steps and a brief form.',
    features: ['Oversized hero type', 'Case-study cards', 'Process timeline', 'Project brief CTA'],
    palette: ['#f7f7f2', '#ff4d2e', '#111111'],
  },
];

export const getTheme = (id) => THEMES.find((t) => t.id === id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const themesByCategory = (catId) => THEMES.filter((t) => t.category === catId);
