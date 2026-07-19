import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>Cris Nogueira</h1>
          <p>Rendas & Sonhos</p>
        </div>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/produtos/novo">Cadastrar</Link>
          <Link href="/movimentar">Bipar / Movimentar</Link>
          <Link href="/movimentacoes">Histórico</Link>
          <form action="/api/auth/logout" method="post">
            <button className="logout" type="submit">Sair ({session?.name})</button>
          </form>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
