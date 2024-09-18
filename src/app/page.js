import Image from "next/image";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";


export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <Projects />
    </div>
  );
}
