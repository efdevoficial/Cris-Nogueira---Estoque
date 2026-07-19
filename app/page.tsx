import AppShell from "@/components/AppShell";
import { sql } from "@/lib/db";
import { money, dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [stats] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE active = true)::int AS products,
      COALESCE(SUM(quantity) FILTER (WHERE active = true), 0)::int AS items,
      COUNT(*) FILTER (WHERE active = true AND quantity <= minimum_stock)::int AS low_stock,
      COALESCE(SUM(quantity * cost_price) FILTER (WHERE active = true), 0)::numeric AS stock_value
    FROM products
  `;

  const recent = await sql`
    SELECT m.id, m.type, m.quantity, m.created_at, p.name, p.barcode
    FROM movements m
    JOIN products p ON p.id = m.product_id
    ORDER BY m.created_at DESC
    LIMIT 8
  `;

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <h2>Visão geral</h2>
          <p>Acompanhe o estoque da loja em tempo real.</p>
        </div>
      </header>

      <section className="grid cards">
        <article className="card"><small>Produtos cadastrados</small><strong>{stats.products}</strong></article>
        <article className="card"><small>Itens em estoque</small><strong>{stats.items}</strong></article>
        <article className="card"><small>Estoque baixo</small><strong>{stats.low_stock}</strong></article>
        <article className="card"><small>Valor de custo</small><strong>{money(stats.stock_value)}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-head"><h3>Últimas movimentações</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Produto</th><th>Código</th><th>Tipo</th><th>Quantidade</th></tr></thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id}>
                  <td>{dateTime(item.created_at)}</td>
                  <td>{item.name}</td>
                  <td>{item.barcode}</td>
                  <td><span className={`badge ${item.type === "SAIDA" ? "low" : "ok"}`}>{item.type}</span></td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
              {!recent.length && <tr><td colSpan={5}>Nenhuma movimentação registrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
