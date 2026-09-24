// Petals Clinic in Bangladesh — copy VERBATIM from the client's page https://www.petalshealth.in/petals-clinic-in-bangladesh/
// (fetched 2026-09-23). Nothing here is written by us or carried over from the Kolkata clinics: no address, doctors,
// hours, email or licence appear on the client's page, so none appear here — each is a copy-pending slot and an item
// on design/client-requests.md (item 21). The page's own claims are held, not published (2026-09-23 decision):
//   HELD — the bullet intro "We are the most trusted Multi-specialty health clinic in Bangladesh because we provide:"
//          (an unverifiable superlative for a clinic that has not opened);
//   HELD — the intro paragraph: it says "we are your trusted multi-speciality health clinic in Bangladesh" and that
//          Petals "has transformed healthcare across Eastern India" — the same kind of claim; whole paragraph held
//          rather than published with sentences cut out of it;
//   HELD — bullet 1 "Renowned doctors with global expertise" (no doctors are named), bullet 4 "Affordable care,
//          uncompromised quality" (no prices; a quality claim, not a service), bullet 5 "Patients-centric approach for
//          higher satisfaction, trusted by families" (comparative, and a track record the clinic cannot have yet);
//   PUBLISHED — bullets 2 and 3, which describe services.
// Phone: the page gives 01784110044 (a Bangladeshi mobile in national format, undiallable from India): shown in
// international form, as agreed. The page's consultation form, consent text and Razorpay terms are a popup shared with
// Ask a Doctor on the old site, not Bangladesh content, and are not used; the site's lead form is not used either (it
// validates Indian mobiles and lists the Kolkata departments) until the client confirms how Bangladesh bookings work.
import { CONTACT } from '../contact.js'

export const BANGLADESH = {
  title: 'Petals Clinic in Bangladesh',                  // h1
  headline: 'Petals Healthcare, Soon in Bangladesh',     // h2
  chapter: 'A New Chapter in Compassionate Care Begins', // h3 on the client's page
  services: [
    'Smart monitoring & management of chronic conditions',
    'Holistic and preventive care for complete wellness',
  ],
  phone: CONTACT.bangladesh.phone,                         // defined once in contact.js (the header, rail and footer use it too)
  hero: { src: '/assets/bangladesh/hero.jpg', alt: 'A reception desk with Petals Health Bangladesh signage' },
  offerTitle: 'Our Services',
  offer: [
    { id: 'gynaecology', title: 'Gynaecology', text: 'Whether it’s your first consultation or pregnancy checkups, our gynaecologists offer compassionate, respectful, and tailored care to every stage of womanhood.' },
    { id: 'paediatrics', title: 'Paediatrics', text: 'Little ones need a lot of care. So, our paediatric team is dedicated to the health and well-being of children, offering gentle and expert care to support their growth and development from day one.' },
    { id: 'cardiology', title: 'Cardiology', text: 'Get precise diagnostics, specialised supervision, and personalised cardiac treatment plans focused on maintaining and improving your heart health.' },
    { id: 'onco-gynaecology', title: 'Onco-Gynaecology', text: 'We provide specialised and supportive care for women facing gynaecological cancers, focusing on comprehensive treatment and well-being.' },
    { id: 'oncology', title: 'Oncology', text: 'From diagnosis to recovery, our oncology services deliver personalised and dedicated care focused on healing and overall well-being.' },
    { id: 'gastroenterology', title: 'Gastroenterology', text: 'Fight everyday digestive discomfort and severe gut disorders with the help and support of our expert gastroenterology team. We understand your needs and help you achieve a comfortable and healthy gut.' },
    { id: 'aesthetic-medicine', title: 'Aesthetic Medicine', text: 'Our aesthetic services blend science with artistry to enhance your natural beauty. So you feel confident in your skin and comfortable with how you look.' },
    { id: 'preventive-care', title: 'Preventive Care', text: 'Our preventive care approach keeps you one step ahead, protecting your well-being with proactive screenings, proper medical guidance, and lifestyle care.' },
  ],
  // what the client's page does not say — shown as copy-pending rows in the contact band
  pending: [
    { label: 'Address', why: 'The client’s page gives no address or city for the Bangladesh clinic' },
    { label: 'Opening date', why: 'The page says “Soon”; no date is given' },
    { label: 'Opening hours', why: 'No hours are given' },
    { label: 'Doctors', why: 'No doctors are named for Bangladesh' },
    { label: 'Book online', why: 'Waiting for the client: where Bangladesh bookings go and which departments they cover' },
  ],
}
