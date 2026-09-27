import { Apple, Carrot, Citrus, Egg, Leaf, Wheat } from "lucide-react";
import type { Extra } from "@/lib/data";

const MAP = { tomato: Apple, leaf: Leaf, carrot: Carrot, citrus: Citrus, egg: Egg, wheat: Wheat };

export function ExtraIcon({ icon, className = "h-6 w-6" }: { icon: Extra["icon"]; className?: string }) {
  const I = MAP[icon];
  return <I className={className} aria-hidden="true" />;
}
