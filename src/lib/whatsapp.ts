// WhatsApp deep-link helpers (FR-WA-01…03).

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+91 99999 99999";
export const WHATSAPP_MESSAGE_PREFIX = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE_PREFIX ?? "Hello Choose Property,";

export function waLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Property message: "Hello Choose Property, I am interested in Property CP-BR-0012. Please share more information about this property." */
export function propertyWhatsAppMessage(propertyId: string): string {
  return `${WHATSAPP_MESSAGE_PREFIX} I am interested in Property ${propertyId}. Please share more information about this property.`;
}

/** Enquiry message: "…I would like to know the availability, documents, location and other details of this property. Thank you." */
export function enquiryWhatsAppMessage(propertyId?: string): string {
  const target = propertyId ? ` ${propertyId}` : " your land/plot";
  return `${WHATSAPP_MESSAGE_PREFIX} I am interested in${target}. I would like to know the availability, documents, location and other details of this property. Thank you.`;
}

export function propertyWaLink(propertyId: string, number = WHATSAPP_NUMBER): string {
  return waLink(number, propertyWhatsAppMessage(propertyId));
}

export function enquiryWaLink(propertyId?: string, number = WHATSAPP_NUMBER): string {
  return waLink(number, enquiryWhatsAppMessage(propertyId));
}

/** Generic site-wide message (header / contact CTA). */
export function genericWhatsAppMessage(): string {
  return `${WHATSAPP_MESSAGE_PREFIX} I would like to know about your available plots and lands. Thank you.`;
}

export function genericWaLink(number = WHATSAPP_NUMBER): string {
  return waLink(number, genericWhatsAppMessage());
}
