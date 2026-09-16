import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Watermark from './components/Watermark.jsx'
import FamilyCare from './components/FamilyCare.jsx'
import Process from './components/Process.jsx'
import Testimonials from './components/Testimonials.jsx'
import Specialists from './components/Specialists.jsx'
import HealthCard from './components/HealthCard.jsx'
import Insights from './components/Insights.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="page">
      <Header />
      <Hero />
      <Watermark part="page" />
      <FamilyCare />
      <Process />
      <Testimonials />
      <Specialists />
      <HealthCard />
      <Insights />
      <Footer />
    </div>
  )
}
