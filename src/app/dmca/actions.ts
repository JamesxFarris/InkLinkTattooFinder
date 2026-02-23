"use server";

import { headers } from "next/headers";
import { isEmailConfigured, sendDmcaEmail } from "@/lib/email";
import { formLimiter } from "@/lib/rate-limit";
import { sanitizeString, isValidEmail, MAX_NAME, MAX_EMAIL, MAX_BUSINESS_NAME, MAX_DETAILS, MAX_SUBJECT } from "@/lib/validation";

type DmcaResult = { success: boolean; message: string };

export async function submitDmca(
  _prev: DmcaResult | null,
  formData: FormData
): Promise<DmcaResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = formLimiter.check(ip);
  if (!allowed) {
    return { success: false, message: "Too many submissions. Please try again in a minute." };
  }

  const name = sanitizeString(formData.get("name") as string | null, MAX_NAME);
  const email = sanitizeString(formData.get("email") as string | null, MAX_EMAIL);
  const businessName = sanitizeString(formData.get("businessName") as string | null, MAX_BUSINESS_NAME);
  const listingId = sanitizeString(formData.get("listingId") as string | null, 20);
  const requestType = sanitizeString(formData.get("requestType") as string | null, MAX_SUBJECT);
  const details = sanitizeString(formData.get("details") as string | null, MAX_DETAILS);
  const sworn = formData.get("sworn");

  if (!name || !email || !businessName || !requestType || !details) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (sworn !== "on") {
    return {
      success: false,
      message: "You must check the sworn statement checkbox to submit this request.",
    };
  }

  if (!isEmailConfigured()) {
    console.log("[DMCA Form] Email not configured. Request:", {
      name,
      email,
      businessName,
      listingId,
      requestType,
      details,
    });
    return {
      success: true,
      message:
        "Thank you for your takedown request. We've received it and will review it within 48 business hours. (Note: email delivery is not yet configured — your request was logged.)",
    };
  }

  const result = await sendDmcaEmail({
    name,
    email,
    businessName,
    listingId,
    requestType,
    details,
  });

  if (!result.success) {
    return {
      success: false,
      message: "Failed to send your request. Please try again or email us directly.",
    };
  }

  return {
    success: true,
    message:
      "Thank you for your takedown request. We've received it and will review it within 48 business hours.",
  };
}
