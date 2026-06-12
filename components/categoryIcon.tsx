import {
  Music,
  Briefcase,
  ShoppingBag,
  Plane,
  Car,
  Users,
  ArrowLeftRight,
  Receipt,
  Smartphone,
  Utensils,
  LucideIcon,
} from "lucide-react";
import type { TxCategory } from "@/lib/data";

export const categoryMeta: Record<
  TxCategory,
  { icon: LucideIcon; tint: string; fg: string }
> = {
  Entertainment: { icon: Music, tint: "bg-[#2a2140]", fg: "text-[#b08cff]" },
  Income: { icon: Briefcase, tint: "bg-[#16301f]", fg: "text-success" },
  Shopping: { icon: ShoppingBag, tint: "bg-[#2e2615]", fg: "text-accent" },
  Travel: { icon: Plane, tint: "bg-[#142a36]", fg: "text-[#5ec5ff]" },
  Transport: { icon: Car, tint: "bg-[#142a36]", fg: "text-[#5ec5ff]" },
  Transfer: { icon: Users, tint: "bg-[#2a2333]", fg: "text-[#c79bff]" },
  Exchange: { icon: ArrowLeftRight, tint: "bg-[#13282a]", fg: "text-[#5fd4cf]" },
  Fees: { icon: Receipt, tint: "bg-[#322020]", fg: "text-[#ef8f8f]" },
  "Top-up": { icon: Smartphone, tint: "bg-[#2e1f2c]", fg: "text-[#e58fc9]" },
  Food: { icon: Utensils, tint: "bg-[#33231a]", fg: "text-[#ff9d6b]" },
};
