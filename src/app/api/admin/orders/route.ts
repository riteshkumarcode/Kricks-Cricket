import { NextResponse } from "next/server";
import { getAllOrders, updateOrderStatus } from "@/lib/orders";
import { logActivity } from "@/lib/cms-store";

export async function GET() {
  const orders = await getAllOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, tracking } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderId, status, tracking);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    logActivity(
      "admin@kricks.com",
      "UPDATE_ORDER_STATUS",
      `Order ${updated.orderNumber} status changed to ${status}${tracking?.number ? ` (Tracking: ${tracking.carrier} ${tracking.number})` : ""}`
    );

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

