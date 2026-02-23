"use server";

import { isEmailConfigured, sendDmcaEmail } from "@/lib/email";

type DmcaResult = { success: boolean; message: string };

export async function submitDmca(
  _prev: DmcaResult | null,
  formData: FormData
): Promise<DmcaResult> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const businessName = (formData.get("businessName") as string | null)?.trim();
  const listingId = (formData.get("listingId") as string | null)?.trim() || null;
  const requestType = (formData.get("requestType") as string | null)?.trim();
  const details = (formData.get("details") as string | null)?.trim();
  const sworn = formData.get("sworn");

  if (!name || !email || !businessName || !requestType || !details) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
