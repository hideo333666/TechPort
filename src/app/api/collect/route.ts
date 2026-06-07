import { NextResponse } from "next/server";
import { collectAll } from "@/server/collector";

export async function POST() {
  const summary = await collectAll();
  return NextResponse.json(summary);
}
