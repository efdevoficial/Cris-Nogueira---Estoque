import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  await sql`UPDATE products SET active = false, updated_at = NOW() WHERE id = ${Number(id)}`;
  return NextResponse.redirect(new URL("/produtos?mensagem=Produto removido.", request.url), 303);
}
