import Hero from '@/components/home/hero'
import Features from '@/components/home/features'
import HowItWorks from '@/components/home/how-it-works'
import Testimonials from '@/components/home/testimonials'
import CTA from '@/components/home/cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  )
}
