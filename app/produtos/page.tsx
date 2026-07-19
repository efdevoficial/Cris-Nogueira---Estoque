import Link from "next/link";
import AppShell from "@/components/AppShell";
import { sql } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ busca?: string; mensagem?: string }>;
}) {
  const params = await searchParams;
  const search = (params.busca ?? "").trim();
  const like = `%${search}%`;

  const products = search
    ? await sql`
        SELECT * FROM products
        WHERE active = true AND (
          barcode ILIKE ${like} OR name ILIKE ${like} OR category ILIKE ${like}
        )
        ORDER BY name
      `
    : await sql`SELECT * FROM products WHERE active = true ORDER BY name`;

  return (
    <AppShell>
      <header className="topbar">
        <div><h2>Produtos</h2><p>Cadastro e consulta do estoque.</p></div>
        <Link className="btn" href="/produtos/novo">Novo produto</Link>
      </header>

      {params.mensagem && <div className="message success">{params.mensagem}</div>}

      <section className="panel">
        <form className="actions" method="get">
          <input name="busca" defaultValue={search} placeholder="Nome, categoria ou código de barras" />
          <button className="btn secondary" type="submit">Pesquisar</button>
        </form>
        <div className="table-wrap" style={{marginTop: 18}}>
          <table>
            <thead><tr><th>Código</th><th>Produto</th><th>Variação</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.barcode}</td>
                  <td><strong>{p.name}</strong><br/><small>{p.category || "Sem categoria"}</small></td>
                  <td>{[p.size, p.color].filter(Boolean).join(" • ") || "—"}</td>
                  <td>{money(p.sale_price)}</td>
                  <td><span className={`badge ${p.quantity <= p.minimum_stock ? "low" : "ok"}`}>{p.quantity}</span></td>
                  <td className="actions">
                    <Link className="btn secondary" href={`/produtos/${p.id}/editar`}>Editar</Link>
                    <form action={`/api/produtos/${p.id}/excluir`} method="post">
                      <button className="btn danger" type="submit">Excluir</button>
                    </form>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={6}>Nenhum produto encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
