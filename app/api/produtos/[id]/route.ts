import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

function number(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const data = await request.formData();

  await sql`
    UPDATE products SET
      barcode = ${String(data.get("barcode") ?? "").trim()},
      name = ${String(data.get("name") ?? "").trim()},
      category = ${String(data.get("category") ?? "").trim() || null},
      size = ${String(data.get("size") ?? "").trim() || null},
      color = ${String(data.get("color") ?? "").trim() || null},
      cost_price = ${Math.max(0, number(data.get("costPrice")))},
      sale_price = ${Math.max(0, number(data.get("salePrice")))},
      minimum_stock = ${Math.max(0, Math.trunc(number(data.get("minimumStock"), 1)))},
      notes = ${String(data.get("notes") ?? "").trim() || null},
      updated_at = NOW()
    WHERE id = ${Number(id)} AND active = true
  `;

  return NextResponse.redirect(new URL("/produtos?mensagem=Produto atualizado.", request.url), 303);
}
