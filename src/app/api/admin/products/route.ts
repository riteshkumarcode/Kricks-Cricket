import { NextResponse } from "next/server";
import { getStoredProducts, saveStoredProducts, updateStoredProduct, createStoredProduct, deleteStoredProduct } from "@/lib/cms-store";

export async function GET() {
  const products = getStoredProducts();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, product, updates } = body;

    if (action === "create") {
      const created = createStoredProduct(product);
      return NextResponse.json({ success: true, product: created });
    }

    if (action === "update") {
      const targetId = id || product?.id || updates?.id;
      const updated = updateStoredProduct(targetId, updates || product);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, product: updated });
    }

    if (action === "delete") {
      const deleted = deleteStoredProduct(id);
      return NextResponse.json({ success: deleted });
    }

    // Default: overwrite array or single update
    if (Array.isArray(body)) {
      saveStoredProducts(body);
      return NextResponse.json({ success: true, count: body.length });
    }

    if (body.id) {
      const updated = updateStoredProduct(body.id, body);
      return NextResponse.json({ success: !!updated, product: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

