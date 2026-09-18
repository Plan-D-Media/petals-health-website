// The three clinics as the About Us and Clinic Location mocks list them (design/svg/4.svg, 6.svg). Ids match
// CLINICS in doctors.js so a doctor's session links straight to its clinic card.
// Copy is verbatim from the mock, including two spellings logged for the client (design/client-requests.md item 13):
// "Cantre" (Centre) and "Oppsite" (Opposite). `mapsQuery` feeds the Get Direction link (Google Maps search); replace
// with the clinics' own place links when the client sends them.
export const SITES = [
  {
    id: 'kankurgachi',
    region: 'North Kolkata',
    name: 'Petals Family Clinic — Kankurgachi',
    tile: ['Petals Family Clinic', 'Kankurgachi'],
    address: ['P30/1, VIP Complex, Kankurgachi,', 'Oppsite Pantaloons, Kolkata: 700054'],
    mapsQuery: 'Petals Health, P30/1 VIP Complex, Kankurgachi, Kolkata 700054',
    photo: { src: '/assets/clinics/kankurgachi.jpg', alt: 'Reception at the Kankurgachi clinic', position: '50% 55%' },
  },
  {
    id: 'loudon-street',
    region: 'Central Kolkata',
    name: 'Calcutta Medical Cantre - a unit of Petals',
    tile: ['Calcutta Medical Cantre', 'a unit of Petals health', 'Loudon Street'],
    address: ['Maruti Building, 1st Floor, 12 Loudon St,', 'Opp. Bellevue Hospital, Kolkata 700017'],
    mapsQuery: 'Calcutta Medical Centre, Maruti Building, 12 Loudon Street, Kolkata 700017',
    photo: { src: '/assets/clinics/loudon-street.png', alt: 'Reception at Calcutta Medical Centre, Loudon Street', position: '50% 50%' },
  },
  {
    id: 'tollygunge',
    region: 'South Kolkata',
    name: 'Petals Family Clinic — Tollygunge',
    tile: ['Petals Family Clinic', 'Tollygunge'],
    address: ['Moore Heights, Moore Avenue,', '93 Manick Bandopadhyay Sarani,', 'Near Malancha Cinema Hall, Kolkata 700040'],
    mapsQuery: 'Petals Health, Moore Heights, Moore Avenue, 93 Manick Bandopadhyay Sarani, Kolkata 700040',
    photo: { src: '/assets/clinics/tollygunge.jpg', alt: 'Reception at the Tollygunge clinic', position: '50% 50%' },
  },
]

export const siteOf = (id) => SITES.find((s) => s.id === id)
export const directionsUrl = (s) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.mapsQuery)

// Map thumbnail: one placeholder image for all three cards, as in the mock (the design uses the same map crop thrice).
export const MAP_THUMB = '/assets/clinics/map.jpg'
