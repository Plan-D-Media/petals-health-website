import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Watermark from './components/Watermark.jsx'
import FamilyCare from './components/FamilyCare.jsx'
import Process from './components/Process.jsx'
import Testimonials from './components/Testimonials.jsx'
import Specialists from './components/Specialists.jsx'
import CaringBlock from './components/CaringBlock.jsx'   // round 3, item 6: replaces the Family Health Card panel
import Insights from './components/Insights.jsx'
import ClosingBand from './components/ClosingBand.jsx'
import Footer from './components/Footer.jsx'
import FormDialog from './components/FormDialog.jsx'

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
      <CaringBlock />
      <Insights />
      <ClosingBand />
      <Footer />
      <FormDialog />
    </div>
  )
}
