"use client";

import { MessageCircle, Phone } from "lucide-react";
import { clsx } from "clsx";
import { propertyWaLink, PHONE_NUMBER } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export function WhatsAppButton({
  propertyId,
  propertyUuid,
  label = "WhatsApp Us",
  size = "md",
  className,
}: {
  propertyId: string;
  propertyUuid?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <a
      href={propertyWaLink(propertyId)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track({ event: "whatsapp_click", propertyId: propertyUuid ?? null, propertyCode: propertyId })
      }
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white transition-opacity hover:opacity-90",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3 text-base",
        className
      )}
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
      {label}
    </a>
  );
}

export function CallButton({
  propertyUuid,
  size = "md",
  className,
}: {
  propertyUuid?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <a
      href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
      onClick={() => track({ event: "call_click", propertyId: propertyUuid ?? null })}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white transition-opacity hover:opacity-90",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3 text-base",
        className
      )}
    >
      <Phone className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
      Call Now
    </a>
  );
}
