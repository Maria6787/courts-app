import { Hero } from "@/components/Hero";
import { CourtsShowcase } from "@/components/CourtsShowcase";
import { BookingGrid } from "@/components/BookingGrid";
import { EquipmentStore } from "@/components/EquipmentStore";

// Landing page: hero → courts showcase → booking grid → sport store.
export default function HomePage() {
  return (
    <>
      <Hero />
      <CourtsShowcase />
      <BookingGrid />
      <EquipmentStore />
    </>
  );
}
