import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";

export const metadata = {
  title: "Home",
  description:
    "Explore Walhez Group services, equipment, projects, and company updates from the main site.",
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <Projects />
      <Testimonials />
    </div>
  );
}
