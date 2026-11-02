import { NextRequest, NextResponse } from "next/server";
import { getCustomerOrders, getAllOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      const all = await getAllOrders();
      return NextResponse.json({ orders: all.slice(0, 10) });
    }

    const orders = await getCustomerOrders(email);
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}

