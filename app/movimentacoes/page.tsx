import AppShell from "@/components/AppShell";
import { sql } from "@/lib/db";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MovementsPage() {
  const movements = await sql`
    SELECT m.*, p.name, p.barcode, u.name AS user_name
    FROM movements m
    JOIN products p ON p.id = m.product_id
    LEFT JOIN users u ON u.id = m.user_id
    ORDER BY m.created_at DESC
    LIMIT 300
  `;

  return (
    <AppShell>
      <header className="topbar"><div><h2>Histórico</h2><p>Registro completo das alterações no estoque.</p></div></header>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Qtd.</th><th>Antes</th><th>Depois</th><th>Usuário</th><th>Observação</th></tr></thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>{dateTime(m.created_at)}</td>
                  <td>{m.name}<br/><small>{m.barcode}</small></td>
                  <td><span className={`badge ${m.type === "SAIDA" ? "low" : "ok"}`}>{m.type}</span></td>
                  <td>{m.quantity}</td><td>{m.previous_quantity}</td><td>{m.new_quantity}</td>
                  <td>{m.user_name || "Sistema"}</td><td>{m.note || "—"}</td>
                </tr>
              ))}
              {!movements.length && <tr><td colSpan={8}>Nenhuma movimentação registrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
