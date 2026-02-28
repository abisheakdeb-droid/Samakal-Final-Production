import { fetchSettings } from "@/lib/actions-settings";
import { NextResponse } from "next/server";

export async function GET() {
  // revalidateTag('settings');
  const settings = await fetchSettings();
  return NextResponse.json(settings);
}
