// The leadership team shown on About Us. The mock draws three unnamed role cards with a stock illustration; names
// and photographs are with the client (design/client-requests.md item 13). Entries without `name` are role
// placeholders: shown as monogram tiles on staging, and the whole section is hidden in a production build until at
// least one real person exists (About.jsx). Add a person as { id, role, name, photo: '/assets/team/<id>.jpg', line }.
export const TEAM = [
  { id: 'ceo', role: 'Chief Executive Officer', initials: 'CEO' },
  { id: 'med-admin', role: 'Medical Administrator', initials: 'MA' },
  { id: 'hr', role: 'Human Resources', initials: 'HR' },
]
export const hasRealPeople = TEAM.some((m) => m.name)

// Careers: the mock's "View job openings" / "Submit your resume" have no destination. `careersEmail` switches the
// CV button on (a mailto); until then it is shown but inert. The enquiry form is the shared lead form tagged
// form: 'careers' so it can be filtered out of patient-lead reporting.
export const careersEmail = ''
