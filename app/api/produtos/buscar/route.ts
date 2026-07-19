import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const barcode = new URL(request.url).searchParams.get("barcode")?.trim();
  if (!barcode) return NextResponse.json({ error: "Informe o código." }, { status: 400 });

  const rows = await sql`
    SELECT id, barcode, name, size, color, quantity
    FROM products
    WHERE barcode = ${barcode} AND active = true
    LIMIT 1
  `;

  if (!rows[0]) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  return NextResponse.json(rows[0]);
}
