import Image from "next/image";

export function Logo({ className = "h-10 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/logo.png" alt="8Mealz" width={660} height={375} className={className} priority={priority} />;
}
