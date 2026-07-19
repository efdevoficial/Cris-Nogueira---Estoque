import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

function number(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await request.formData();
  const barcode = String(data.get("barcode") ?? "").trim();
  const name = String(data.get("name") ?? "").trim();
  const quantity = Math.max(0, Math.trunc(number(data.get("quantity"))));

  if (!barcode || !name) {
    return NextResponse.json({ error: "Código e nome são obrigatórios." }, { status: 400 });
  }

  try {
    const inserted = await sql.begin(async (tx) => {
      const rows = await tx`
        INSERT INTO products (
          barcode, name, category, size, color, cost_price, sale_price,
          quantity, minimum_stock, notes
        ) VALUES (
          ${barcode}, ${name}, ${String(data.get("category") ?? "").trim() || null},
          ${String(data.get("size") ?? "").trim() || null},
          ${String(data.get("color") ?? "").trim() || null},
          ${Math.max(0, number(data.get("costPrice")))},
          ${Math.max(0, number(data.get("salePrice")))},
          ${quantity},
          ${Math.max(0, Math.trunc(number(data.get("minimumStock"), 1)))},
          ${String(data.get("notes") ?? "").trim() || null}
        )
        RETURNING id
      `;
      if (quantity > 0) {
        await tx`
          INSERT INTO movements (
            product_id, user_id, type, quantity, previous_quantity, new_quantity, note
          ) VALUES (
            ${rows[0].id}, ${session.userId}, 'ENTRADA', ${quantity}, 0, ${quantity},
            'Estoque inicial'
          )
        `;
      }
      return rows[0];
    });

    return NextResponse.redirect(
      new URL(`/produtos?mensagem=Produto cadastrado com sucesso.`, request.url),
      303
    );
  } catch (error) {
    const message = error instanceof Error && error.message.includes("unique")
      ? "Este código de barras já está cadastrado."
      : "Não foi possível cadastrar o produto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
