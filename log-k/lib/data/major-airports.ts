export interface Airport {
  icao: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
}

// Major European commercial airports
export const MAJOR_AIRPORTS: Airport[] = [
  // Germany
  { icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0333, lng: 8.5706 },
  { icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.3538, lng: 11.7861 },
  { icao: 'EDDB', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany', lat: 52.3667, lng: 13.5033 },
  { icao: 'EDDL', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany', lat: 51.2895, lng: 6.7668 },
  { icao: 'EDDH', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany', lat: 53.6304, lng: 9.9882 },
  { icao: 'EDDK', name: 'Cologne Bonn', city: 'Cologne', country: 'Germany', lat: 50.8659, lng: 7.1427 },
  { icao: 'EDDS', name: 'Stuttgart Airport', city: 'Stuttgart', country: 'Germany', lat: 48.6899, lng: 9.2219 },
  
  // UK
  { icao: 'EGLL', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543 },
  { icao: 'EGKK', name: 'Gatwick', city: 'London', country: 'UK', lat: 51.1537, lng: -0.1821 },
  { icao: 'EGSS', name: 'Stansted', city: 'London', country: 'UK', lat: 51.8850, lng: 0.2350 },
  { icao: 'EGCC', name: 'Manchester', city: 'Manchester', country: 'UK', lat: 53.3537, lng: -2.2750 },
  { icao: 'EGPH', name: 'Edinburgh', city: 'Edinburgh', country: 'UK', lat: 55.9508, lng: -3.3615 },
  
  // France
  { icao: 'LFPG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { icao: 'LFPO', name: 'Orly', city: 'Paris', country: 'France', lat: 48.7233, lng: 2.3792 },
  { icao: 'LFMN', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France', lat: 43.6584, lng: 7.2158 },
  { icao: 'LFML', name: 'Marseille Provence', city: 'Marseille', country: 'France', lat: 43.4356, lng: 5.2139 },
  { icao: 'LFLL', name: 'Lyon-Saint Exupéry', city: 'Lyon', country: 'France', lat: 45.7263, lng: 5.0908 },
  
  // Netherlands
  { icao: 'EHAM', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3086, lng: 4.7639 },
  
  // Belgium
  { icao: 'EBBR', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', lat: 50.9014, lng: 4.4844 },
  
  // Spain
  { icao: 'LEMD', name: 'Adolfo Suárez Madrid', city: 'Madrid', country: 'Spain', lat: 40.4936, lng: -3.5668 },
  { icao: 'LEBL', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', lat: 41.2971, lng: 2.0785 },
  { icao: 'LEPA', name: 'Palma de Mallorca', city: 'Palma', country: 'Spain', lat: 39.5517, lng: 2.7388 },
  
  // Italy
  { icao: 'LIRF', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italy', lat: 41.8003, lng: 12.2389 },
  { icao: 'LIMC', name: 'Malpensa', city: 'Milan', country: 'Italy', lat: 45.6306, lng: 8.7281 },
  { icao: 'LIPZ', name: 'Marco Polo', city: 'Venice', country: 'Italy', lat: 45.5053, lng: 12.3519 },
  
  // Switzerland
  { icao: 'LSZH', name: 'Zürich Airport', city: 'Zürich', country: 'Switzerland', lat: 47.4647, lng: 8.5492 },
  { icao: 'LSGG', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', lat: 46.2381, lng: 6.1089 },
  
  // Austria
  { icao: 'LOWW', name: 'Vienna International', city: 'Vienna', country: 'Austria', lat: 48.1103, lng: 16.5697 },
  
  // Scandinavia
  { icao: 'EKCH', name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', lat: 55.6179, lng: 12.6560 },
  { icao: 'ESSA', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', lat: 59.6519, lng: 17.9186 },
  { icao: 'ENGM', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway', lat: 60.1939, lng: 11.1004 },
  { icao: 'EFHK', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', lat: 60.3172, lng: 24.9633 },
  
  // Eastern Europe
  { icao: 'EPWA', name: 'Warsaw Chopin', city: 'Warsaw', country: 'Poland', lat: 52.1657, lng: 20.9671 },
  { icao: 'LKPR', name: 'Václav Havel Prague', city: 'Prague', country: 'Czech Republic', lat: 50.1008, lng: 14.2600 },
  
  // Portugal
  { icao: 'LPPT', name: 'Humberto Delgado', city: 'Lisbon', country: 'Portugal', lat: 38.7813, lng: -9.1359 },
  
  // Ireland
  { icao: 'EIDW', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', lat: 53.4213, lng: -6.2701 },
  
  // Greece
  { icao: 'LGAV', name: 'Athens International', city: 'Athens', country: 'Greece', lat: 37.9364, lng: 23.9445 },
  
  // Turkey
  { icao: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lng: 28.7519 },
]