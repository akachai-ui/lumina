import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PainPoints } from "../components/PainPoints";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { Pricing } from "../components/Pricing";
import { CtaBanner } from "../components/CtaBanner";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PainPoints />
        <FeatureShowcase />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
