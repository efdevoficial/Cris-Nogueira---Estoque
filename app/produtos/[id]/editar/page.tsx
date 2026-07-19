import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProductForm from "@/components/ProductForm";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await sql`SELECT * FROM products WHERE id = ${Number(id)} AND active = true LIMIT 1`;
  if (!products[0]) notFound();

  return (
    <AppShell>
      <header className="topbar"><div><h2>Editar produto</h2><p>Atualize os dados sem alterar o histórico.</p></div></header>
      <ProductForm product={products[0]} />
    </AppShell>
  );
}
