import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getItemById } from "@/features/items";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/items/[id]">
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const item = await getItemById(id);
  if (!item) {
    return NextResponse.json(
      { success: false, error: "Item not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: item });
}
