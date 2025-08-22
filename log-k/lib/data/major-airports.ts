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
  
  // USA - East Coast
  { icao: 'KJFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.6398, lng: -73.7789 },
  { icao: 'KEWR', name: 'Newark Liberty', city: 'Newark', country: 'USA', lat: 40.6925, lng: -74.1687 },
  { icao: 'KLGA', name: 'LaGuardia', city: 'New York', country: 'USA', lat: 40.7772, lng: -73.8726 },
  { icao: 'KBOS', name: 'Logan International', city: 'Boston', country: 'USA', lat: 42.3643, lng: -71.0052 },
  { icao: 'KIAD', name: 'Washington Dulles', city: 'Washington DC', country: 'USA', lat: 38.9447, lng: -77.4558 },
  { icao: 'KMIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.7932, lng: -80.2906 },
  { icao: 'KATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA', lat: 33.6367, lng: -84.4281 },
  { icao: 'KCLT', name: 'Charlotte Douglas', city: 'Charlotte', country: 'USA', lat: 35.2140, lng: -80.9431 },
  
  // USA - Central
  { icao: 'KORD', name: "O'Hare International", city: 'Chicago', country: 'USA', lat: 41.9786, lng: -87.9048 },
  { icao: 'KDFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'USA', lat: 32.8968, lng: -97.0380 },
  { icao: 'KIAH', name: 'George Bush', city: 'Houston', country: 'USA', lat: 29.9844, lng: -95.3414 },
  { icao: 'KDEN', name: 'Denver International', city: 'Denver', country: 'USA', lat: 39.8617, lng: -104.6732 },
  { icao: 'KMSP', name: 'Minneapolis-St Paul', city: 'Minneapolis', country: 'USA', lat: 44.8848, lng: -93.2223 },
  { icao: 'KDTW', name: 'Detroit Metropolitan', city: 'Detroit', country: 'USA', lat: 42.2124, lng: -83.3534 },
  
  // USA - West Coast
  { icao: 'KLAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', lat: 33.9425, lng: -118.4081 },
  { icao: 'KSFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', lat: 37.6190, lng: -122.3749 },
  { icao: 'KSEA', name: 'Seattle-Tacoma', city: 'Seattle', country: 'USA', lat: 47.4502, lng: -122.3088 },
  { icao: 'KLAS', name: 'Harry Reid', city: 'Las Vegas', country: 'USA', lat: 36.0840, lng: -115.1537 },
  { icao: 'KPHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', country: 'USA', lat: 33.4343, lng: -112.0116 },
  { icao: 'KSAN', name: 'San Diego International', city: 'San Diego', country: 'USA', lat: 32.7336, lng: -117.1897 },
  
  // Canada
  { icao: 'CYYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada', lat: 43.6777, lng: -79.6248 },
  { icao: 'CYVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', lat: 49.1939, lng: -123.1844 },
  { icao: 'CYUL', name: 'Montréal-Trudeau', city: 'Montreal', country: 'Canada', lat: 45.4706, lng: -73.7408 },
  { icao: 'CYYC', name: 'Calgary International', city: 'Calgary', country: 'Canada', lat: 51.1225, lng: -113.8944 },
  
  // Asia - Japan
  { icao: 'RJTT', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', lat: 35.5533, lng: 139.7811 },
  { icao: 'RJAA', name: 'Narita International', city: 'Tokyo', country: 'Japan', lat: 35.7653, lng: 140.3864 },
  { icao: 'RJGG', name: 'Chubu Centrair', city: 'Nagoya', country: 'Japan', lat: 34.8581, lng: 136.8056 },
  { icao: 'RJBB', name: 'Kansai International', city: 'Osaka', country: 'Japan', lat: 34.4347, lng: 135.2442 },
  
  // Asia - China
  { icao: 'ZBAA', name: 'Beijing Capital', city: 'Beijing', country: 'China', lat: 40.0801, lng: 116.5844 },
  { icao: 'ZSPD', name: 'Shanghai Pudong', city: 'Shanghai', country: 'China', lat: 31.1434, lng: 121.8053 },
  { icao: 'VHHH', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3080, lng: 113.9185 },
  { icao: 'ZGGG', name: 'Guangzhou Baiyun', city: 'Guangzhou', country: 'China', lat: 23.3924, lng: 113.2988 },
  
  // Asia - Southeast
  { icao: 'WSSS', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', lat: 1.3502, lng: 103.9944 },
  { icao: 'WMKK', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lng: 101.7099 },
  { icao: 'VTBS', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', lat: 13.6811, lng: 100.7472 },
  { icao: 'VVNB', name: 'Noi Bai', city: 'Hanoi', country: 'Vietnam', lat: 21.2212, lng: 105.8070 },
  
  // Asia - South
  { icao: 'VIDP', name: 'Indira Gandhi', city: 'New Delhi', country: 'India', lat: 28.5665, lng: 77.1031 },
  { icao: 'VABB', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', lat: 19.0887, lng: 72.8679 },
  
  // Middle East
  { icao: 'OMDB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.2528, lng: 55.3644 },
  { icao: 'OTHH', name: 'Hamad International', city: 'Doha', country: 'Qatar', lat: 25.2733, lng: 51.6081 },
  { icao: 'OIII', name: 'Imam Khomeini', city: 'Tehran', country: 'Iran', lat: 35.4161, lng: 51.1522 },
  { icao: 'LLBG', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', lat: 32.0114, lng: 34.8867 },
  { icao: 'OERK', name: 'King Khalid', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.9576, lng: 46.6988 },
  
  // Australia & New Zealand
  { icao: 'YSSY', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9461, lng: 151.1772 },
  { icao: 'YMML', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', lat: -37.6733, lng: 144.8433 },
  { icao: 'YBBN', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', lat: -27.3842, lng: 153.1175 },
  { icao: 'YPPH', name: 'Perth Airport', city: 'Perth', country: 'Australia', lat: -31.9403, lng: 115.9669 },
  { icao: 'NZAA', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lng: 174.7917 },
  
  // South America
  { icao: 'SBGR', name: 'São Paulo–Guarulhos', city: 'São Paulo', country: 'Brazil', lat: -23.4356, lng: -46.4731 },
  { icao: 'SBGL', name: 'Rio de Janeiro–Galeão', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.8100, lng: -43.2506 },
  { icao: 'SAEZ', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', lat: -34.8222, lng: -58.5358 },
  { icao: 'SCEL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', lat: -33.3930, lng: -70.7858 },
  { icao: 'SKBO', name: 'El Dorado', city: 'Bogotá', country: 'Colombia', lat: 4.7016, lng: -74.1469 },
  { icao: 'MMMX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', lat: 19.4363, lng: -99.0721 },
  
  // Africa
  { icao: 'FAOR', name: 'OR Tambo', city: 'Johannesburg', country: 'South Africa', lat: -26.1367, lng: 28.2460 },
  { icao: 'FACT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa', lat: -33.9648, lng: 18.6017 },
  { icao: 'HECA', name: 'Cairo International', city: 'Cairo', country: 'Egypt', lat: 30.1219, lng: 31.4056 },
  { icao: 'DIAP', name: 'Félix-Houphouët-Boigny', city: 'Abidjan', country: 'Ivory Coast', lat: 5.2614, lng: -3.9263 },
  { icao: 'HAAB', name: 'Bole International', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.9779, lng: 38.7997 },
  { icao: 'HKJK', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lng: 36.9278 },
]