import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import TrustElements from '@/components/landing/TrustElements';
import FacadeAnatomy from '@/components/landing/FacadeAnatomy';
import VideoShowcase from '@/components/landing/VideoShowcase';

import Portfolio from '@/components/landing/Portfolio';
import InteractiveMap from '@/components/landing/InteractiveMap';
import VideoTestimonials from '@/components/landing/VideoTestimonials';
import SocialFeed from '@/components/landing/SocialFeed';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FacadeAnatomy />
        <TrustElements />
        <VideoShowcase />

        <Portfolio />
        <InteractiveMap />
        <VideoTestimonials />
        <SocialFeed />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
