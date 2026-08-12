
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/homepage/Hero";
import FeaturedCategories from "@/components/homepage/FeaturedCategories";
import FeaturedProducts from "@/components/homepage/FeaturedProducts";
import WhyChoose from "@/components/homepage/WhyChoose";
import HowItWorks from "@/components/homepage/HowItWorks";
import Testimonials from "@/components/homepage/Testimonials";
import PortfolioPreview from "@/components/homepage/PortfolioPreview";
import CallToAction from "@/components/homepage/CallToAction";
import InstagramGallery from "@/components/homepage/InstagramGallery";


export default function HomePage() {
  

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">


      {/* 1. Top Brand Navigation Bar */}
      <Navbar />

      <main className="flex-grow">
        
     <Hero />

     <FeaturedCategories />

     <FeaturedProducts />  

     <WhyChoose />

     <HowItWorks />

     <Testimonials />

     <PortfolioPreview />

     <InstagramGallery /> 
    
      </main>

    <CallToAction />

  
  </div>
 )
}