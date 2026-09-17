// Testimonials for the Home carousel. PLACEHOLDER CONTENT — every entry is marked `placeholder: true` and the card shows
// a "Placeholder" tag until the client supplies real, consented patient stories (name, treatment, clinic, quote,
// rating). The first three are the quotes drawn in the Home mock; the rest are invented to fill the carousel.
// Schema: { id, name, initials, role ("<treatment> · <clinic>"), quote, rating (1–5), placeholder }
export const TESTIMONIALS = [
  { id: 't1', name: 'Isha Agarwal', initials: 'IA', role: 'Pregnancy Care · Kankurgachi', rating: 5, placeholder: true,
    quote: 'My entire pregnancy was a smooth ride with the team here. The doctors made me feel very comfortable every single visit.' },
  { id: 't2', name: 'Harshita Nahata', initials: 'HA', role: 'Antenatal Care · Kankurgachi', rating: 5, placeholder: true,
    quote: 'The clinic has sonography, tests, and everything under one roof. Dr. Smita is very patient and reassuring — wonderful for expecting mothers.' },
  { id: 't3', name: 'Sushmita Mitra', initials: 'SM', role: 'Medical Care · CMC', rating: 5, placeholder: true,
    quote: 'The clinic is very well organised, clean and efficient. The staff is courteous, knowledgeable and helpful. Highly recommend.' },
  { id: 't4', name: 'Rahul Sen', initials: 'RS', role: 'Paediatrics · Tollygunge', rating: 5, placeholder: true,
    quote: 'Our daughter’s vaccinations and check-ups have all been here. Appointments run on time and the paediatrician explains everything.' },
  { id: 't5', name: 'Priya Banerjee', initials: 'PB', role: 'Diagnostics · Loudon Street', rating: 5, placeholder: true,
    quote: 'Blood collection at home and the report on my phone the same evening. Simple, and the phlebotomist was gentle with my mother.' },
  { id: 't6', name: 'Arjun Dutta', initials: 'AD', role: 'Cardiology · Loudon Street', rating: 5, placeholder: true,
    quote: 'A thorough consultation, no rush, and a clear plan. The video follow-up saved me a trip across the city.' },
]
