import { fetchSettings } from "@/lib/actions-settings";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
// revalidateTag('settings');
  const settings = await fetchSettings();
  return NextResponse.json(settings);
}
