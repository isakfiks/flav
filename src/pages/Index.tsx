import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Comparison from "@/components/landing/Comparison";
import Philosophy from "@/components/landing/Philosophy";
import OpenSource from "@/components/landing/OpenSource";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <Comparison />
      <Philosophy />
      <div id="getting-started">
        <OpenSource />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
