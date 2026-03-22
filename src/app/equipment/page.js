import EquipmentShowcase from "@/components/EquipmentShowcase";
import { getAllEquipment } from "@/lib/walhez-data";

export const metadata = {
  title: "Equipment | Walhez",
  description: "Browse Walhez equipment sourced from the server database.",
};

export default async function EquipmentPage() {
  const equipment = await getAllEquipment();

  return <EquipmentShowcase equipment={equipment} />;
}
