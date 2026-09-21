// SXO agent copy (design/round2-report.md §6). Every string the agent shows lives here so the client can edit it.
export default {
  avatarAlt: 'Petals Health care team',
  name: 'Petals care team',
  prompt: 'Tell us how we can help',
  promptSub: 'Two quick questions and we will point you to the right doctor.',
  who: {
    question: 'Who is this for?',
    options: [{ id: 'me', label: 'Me' }, { id: 'child', label: 'My child' }, { id: 'family', label: 'A family member' }],
  },
  need: {
    question: 'What do you need?',
    options: [{ id: 'appointment', label: 'An appointment' }, { id: 'callback', label: 'A call back' }, { id: 'test', label: 'A test or check-up' }],
  },
  formIntro: 'Leave your details and we will call you back, usually within an hour during clinic hours.',
  back: 'Back',
  dismiss: 'Not now',
  close: 'Close',
  callInstead: 'Or call 9147405955',
}
