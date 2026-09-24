// Contact context for the site chrome (Header, its action bar and rail, Footer). A page passes `region` to Header and
// Footer; everything else is the Kolkata default.
//   kolkata    — the site's one number, and the booking / Ask a Doctor dialog (Indian mobiles, Kolkata departments).
//   bangladesh — (2026-09-24, option B) the Bangladesh clinic's number from the client's page (01784110044, shown in
//                international form so it can be dialled from India); no dialog — the form rejects Bangladeshi numbers
//                and lists Kolkata departments — so every Book / Ask action becomes a call. Until the client says how
//                Bangladesh bookings work (design/client-requests.md item 21).
export const CONTACT = {
  kolkata: { phone: { label: '9147405955', href: 'tel:9147405955' }, forms: true },
  bangladesh: { phone: { label: '+880 1784-110044', href: 'tel:+8801784110044' }, forms: false, name: 'Petals Clinic in Bangladesh', call: 'Call the clinic' },
}
export const contactFor = (region) => CONTACT[region] || CONTACT.kolkata
