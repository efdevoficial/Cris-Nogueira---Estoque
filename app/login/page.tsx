export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Cris Nogueira</h1>
        <p>Rendas & Sonhos • Controle de estoque</p>
        {params.erro && <div className="message error">{params.erro}</div>}
        <form method="post" action="/api/auth/login">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <button className="btn" type="submit">Entrar no sistema</button>
        </form>
      </section>
    </main>
  );
}
