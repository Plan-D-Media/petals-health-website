import Icon from './Icon.jsx'
import './Proof.css'

// The proof strip: location pill + the two stat tiles (design/hero-values.md atoms), used by the hero (on the film
// card's corner) and by the closing band. `card` wraps it in the white strip; without it the atoms sit inline.
export default function Proof({ card = true, className = '' }) {
  return (
    <div className={`proof${card ? ' proof--card' : ''} ${className}`.trim()}>
      <div className="proof__pill">
        <Icon name="pin" className="proof__pill-icon" />
        <span className="proof__pill-text">3 Clinics in Kolkata</span>
      </div>
      <div className="proof__stats">
        <div className="stat stat--doctors">
          <div className="stat__value">100+</div>
          <div className="stat__label">Specialist<br />Doctor</div>
        </div>
        <div className="stat stat--rating">
          <div className="stat__value">4.8<Icon name="star" className="stat__star" /></div>
          <div className="stat__label">Google<br />Rating</div>
        </div>
      </div>
    </div>
  )
}
