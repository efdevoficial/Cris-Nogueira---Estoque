import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await request.formData();
  const productId = Number(data.get("productId"));
  const quantity = Math.trunc(Number(data.get("quantity")));
  const type = String(data.get("type"));
  const note = String(data.get("note") ?? "").trim() || null;

  if (!productId || !Number.isInteger(quantity) || quantity <= 0 || !["ENTRADA", "SAIDA"].includes(type)) {
    return NextResponse.json({ error: "Dados da movimentação são inválidos." }, { status: 400 });
  }

  try {
    const result = await sql.begin(async (tx) => {
      const products = await tx`
        SELECT id, quantity FROM products
        WHERE id = ${productId} AND active = true
        FOR UPDATE
      `;
      const product = products[0];
      if (!product) throw new Error("Produto não encontrado.");

      const previous = Number(product.quantity);
      const next = type === "ENTRADA" ? previous + quantity : previous - quantity;
      if (next < 0) throw new Error("Estoque insuficiente para esta saída.");

      await tx`UPDATE products SET quantity = ${next}, updated_at = NOW() WHERE id = ${productId}`;
      await tx`
        INSERT INTO movements (
          product_id, user_id, type, quantity, previous_quantity, new_quantity, note
        ) VALUES (
          ${productId}, ${session.userId}, ${type}, ${quantity}, ${previous}, ${next}, ${note}
        )
      `;
      return next;
    });

    return NextResponse.json({
      message: "Movimentação registrada com sucesso.",
      newQuantity: result
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao movimentar estoque." },
      { status: 400 }
    );
  }
}
